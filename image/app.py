from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import pandas as pd
from fpdf import FPDF
from geopy.distance import geodesic
import folium
import os

# Define the PDF class inheriting from FPDF
class PDF(FPDF):
    pass

# ✅ Define the path to the logo
LOGO_PATH = "./frontend/src/ui_images/logo.png"  # Update the path to your logo file

# Initialize Flask application
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Load the trained damage detection model
damage_detection_model = tf.keras.models.load_model('vehicle_damage_detection_final.keras')

# Load the repair cost estimation model
repair_cost_model = tf.keras.models.load_model('repair_cost_estimation_model.keras')

# Define damage types based on the damage detection model's training
damage_types = [
    'No_Damage', 'door_dent', 'glass_shatter', 'door_scratch', 'bumper_dent', 
    'tail_lamp', 'head_lamp', 'bumper_scratch', 'severe_damage', 'front_damage', 
    'tire_damage', 'side_damage'
]

# Define a confidence threshold for predictions
CONFIDENCE_THRESHOLD = 0.6

# Load repair shop data (CSV should have a 'Services' column)
repair_shops = pd.read_csv("repair_shops.csv")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Check if an image was uploaded
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']
        
        # Open and resize the image to match the models' expected input size (224x224)
        image = Image.open(file).resize((224, 224))

        # Preprocess image (convert to numpy array, normalize, expand dims for batch)
        image_array = np.expand_dims(np.array(image) / 255.0, axis=0)

        # Predict damage type and bounding box
        pred_bbox, pred_label = damage_detection_model.predict(image_array)
        confidence = float(np.max(pred_label))  # Confidence for the predicted damage type
        predicted_damage = damage_types[np.argmax(pred_label)]  # Get the damage type with the highest probability

        # Apply a confidence threshold to filter out uncertain predictions
        if confidence < CONFIDENCE_THRESHOLD:
            return jsonify({
                'error': 'Confidence too low for a reliable prediction',
                'predicted_damage': predicted_damage,
                'confidence': confidence
            }), 400
        
        # Use the same preprocessed image tensor as input for the repair cost model
        repair_cost_input = np.copy(image_array)

        # Predict repair cost using the second model
        estimated_cost = repair_cost_model.predict(repair_cost_input).flatten()[0]

        # Prepare the response
        response = {
            'predicted_damage': predicted_damage,
            'confidence': confidence,
            'predicted_bbox': pred_bbox[0].tolist(),  # Convert the bounding box to a list for easy JSON serialization
            'estimated_repair_cost': float(estimated_cost)  # Convert to float for JSON serialization
        }

        return jsonify(response)

    except Exception as e:
        # Return error if something goes wrong
        return jsonify({'error': str(e)}), 500

@app.route('/recommend_repair', methods=['POST'])
def recommend_repair():
    try:
        data = request.json
        user_location = (data["latitude"], data["longitude"])

        print("Received Data:", data)  # Debugging

        # Ensure Latitude & Longitude are numeric
        repair_shops["Latitude"] = pd.to_numeric(repair_shops["Latitude"], errors="coerce")
        repair_shops["Longitude"] = pd.to_numeric(repair_shops["Longitude"], errors="coerce")
        repair_shops.dropna(subset=["Latitude", "Longitude"], inplace=True)

        # Calculate distance for all repair shops
        repair_shops["distance"] = repair_shops.apply(
            lambda row: geodesic(user_location, (row["Latitude"], row["Longitude"])).km, axis=1
        )

        # Get the 3 nearest shops
        nearest_shops = repair_shops.sort_values(by="distance").head(3)

        # Select only necessary fields
        filtered_shops = nearest_shops[["name", "addr:city", "Latitude", "Longitude", "distance"]]

        return jsonify(filtered_shops.to_dict(orient="records"))

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate_map', methods=['GET'])
def generate_map():
    """Generate an interactive map of repair shops and return the HTML file."""
    try:
        # Create a map centered at a default location (e.g., Malabe, Sri Lanka)
        m = folium.Map(location=[6.9149, 79.9736], zoom_start=10)

        # Add repair shops as markers
        for _, row in repair_shops.iterrows():
            folium.Marker(
                [row["Latitude"], row["Longitude"]],
                popup=row.get("name", "Unknown Shop"),
                tooltip=row.get("name", "Unknown Shop"),
                icon=folium.Icon(color="blue", icon="wrench", prefix="fa")
            ).add_to(m)

        # Save map to the 'templates' directory
        map_path = os.path.join("templates", "repair_shops_map.html")
        m.save(map_path)

        return jsonify({"message": "Map generated successfully!", "map_url": "/map"})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/map', methods=['GET'])
def view_map():
    """Serve the generated map."""
    return render_template("repair_shops_map.html")

# ✅ Create a Custom PDF Class with a Header (Including Logo)
class PDF(FPDF):
    def header(self):
        """Custom header with GreenAuto logo and title."""
        if os.path.exists(LOGO_PATH):
            self.image(LOGO_PATH, 10, 8, 30)  # (x, y, width)
        
        self.set_font("Arial", "B", 16)
        self.set_text_color(0, 51, 102)  # Dark Blue
        self.cell(200, 10, "GreenAuto - Vehicle Damage & Repair Cost Report", ln=True, align="C")
        self.ln(10)  # Line break for spacing

        

@app.route('/generate_report', methods=['POST'])
def generate_report():
    """Generates a professional and attractive PDF report for vehicle damage detection and repair cost estimation."""
    try:
        # ✅ Step 1: Validate the incoming JSON data
        data = request.json

        print("📥 Received Data for Report:", data)  # Debugging

        if not data or "damage_type" not in data or "repair_cost" not in data or "repair_shops" not in data:
            print("❌ Error: Missing required fields in request data.")
            return jsonify({"error": "Invalid request data"}), 400

        damage_type = data["damage_type"]
        repair_cost = data["repair_cost"]
        repair_shops_data = data["repair_shops"]

        if not isinstance(repair_shops_data, list):
            print("❌ Error: Repair shops data is not in list format.")
            return jsonify({"error": "Invalid format for repair shops"}), 400

        # ✅ Step 2: Create a PDF Report using UTF-8 encoding
        pdf = PDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()

        
        # 🔹 Section 1: Damage Information
        pdf.set_font("Arial", "B", 12)
        pdf.set_fill_color(173, 216, 230)  # Light Blue
        pdf.cell(0, 10, "Damage Details", ln=True, fill=True)
        pdf.set_font("Arial", "", 12)
        pdf.cell(0, 10, f"Detected Damage Type: {damage_type}", ln=True)
        pdf.cell(0, 10, f"Estimated Repair Cost: Rs.{repair_cost:.2f}", ln=True)
        pdf.ln(10)

        # 🔹 Section 2: Repair Shops Table
        if repair_shops_data:
            pdf.set_font("Arial", "B", 12)
            pdf.set_fill_color(173, 216, 230)  # Light Blue
            pdf.cell(0, 10, "Recommended Repair Shops", ln=True, fill=True)
            pdf.ln(5)

            # Table Headers
            pdf.set_font("Arial", "B", 11)
            pdf.set_text_color(255, 255, 255)  # White
            pdf.set_fill_color(0, 102, 204)  # Dark Blue
            pdf.cell(80, 10, "Shop Name", border=1, align="C", fill=True)
            pdf.cell(50, 10, "Distance (km)", border=1, align="C", fill=True)
            pdf.cell(50, 10, "City", border=1, align="C", fill=True)
            pdf.ln()

            # Table Content
            pdf.set_font("Arial", "", 11)
            pdf.set_text_color(0, 0, 0)  # Black
            for shop in repair_shops_data:
                pdf.cell(80, 10, shop.get("name", "Unknown").encode('latin-1', 'ignore').decode('latin-1'), border=1, align="C")
                pdf.cell(50, 10, f"{shop.get('distance', 0):.2f}", border=1, align="C")
                pdf.cell(50, 10, shop.get("addr:city", "Not Specified").encode('latin-1', 'ignore').decode('latin-1'), border=1, align="C")
                pdf.ln()
        else:
            pdf.cell(0, 10, "No repair shops found nearby.", ln=True)

        # 🔹 Footer Note
        pdf.ln(10)
        pdf.set_font("Arial", "I", 10)
        pdf.set_text_color(100, 100, 100)
        pdf.multi_cell(0, 10, 
    "GreenAuto is your trusted AI-powered vehicle damage assessment and repair cost estimation platform. "
    "We help drivers and insurance providers make informed decisions with accurate, real-time analysis. "
    "Find the best repair services near you and explore eco-friendly vehicle solutions to reduce your carbon footprint.\n\n"
    "For support, visit our website: www.greenauto.com | Email: support@greenauto.com | Hotline: +94 76 123 4567", 
    align="C"
)

        # ✅ Step 3: Save & Send the Report
        report_filename = "vehicle_damage_report.pdf"
        pdf.output(report_filename, "F")

        print("✅ Report Generated Successfully:", report_filename)
        return send_file(report_filename, as_attachment=True)

    except Exception as e:
        print("❌ Error in Report Generation:", str(e))  # Debugging
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the Flask application
    if not os.path.exists("templates"):
        os.makedirs("templates")
    app.run(debug=True)
