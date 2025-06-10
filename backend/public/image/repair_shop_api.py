from flask import Flask, request, jsonify
import pandas as pd
from geopy.distance import geodesic
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

# Load repair shop data (CSV should have a 'Services' column)
repair_shops = pd.read_csv("repair_shops.csv")

@app.route('/recommend_repair', methods=['POST'])
def recommend_repair():
    data = request.json
    user_location = (data["latitude"], data["longitude"])
    damage_type = data["damage_type"].lower()  # Convert to lowercase for matching

    # Calculate distance from user location
    repair_shops["distance"] = repair_shops.apply(
        lambda row: geodesic(user_location, (row["Latitude"], row["Longitude"])).km, axis=1
    )

    # Filter shops that offer the required service
    filtered_shops = repair_shops[repair_shops["Services"].str.contains(damage_type, case=False, na=False)]
    
    # Sort by distance and return top 3
    nearest_shops = filtered_shops.sort_values(by="distance").head(3)

    return jsonify(nearest_shops.to_dict(orient="records"))

if __name__ == '__main__':
    app.run(debug=True)
