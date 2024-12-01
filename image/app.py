from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image

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

if __name__ == '__main__':
    # Run the Flask application
    app.run(debug=True)
