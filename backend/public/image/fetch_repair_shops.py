import requests
import csv
import json

# Define Overpass API URL
overpass_url = "http://overpass-api.de/api/interpreter"

# Query for car repair shops in Sri Lanka
query = """
[out:json];
node["shop"="car_repair"](6.7,79.8,7.0,80.0);
out;
"""

try:
    # Send API request
    response = requests.get(overpass_url, params={"data": query}, timeout=20)
    response.raise_for_status()

    # Parse JSON response
    data = response.json()

    # Check if 'elements' exist in the response
    if "elements" in data and len(data["elements"]) > 0:
        print("\n✅ Successfully retrieved repair shop data!\n")

        # Extract all possible tag keys dynamically
        all_tags = set()
        for shop in data["elements"]:
            all_tags.update(shop.get("tags", {}).keys())

        # Define CSV headers (ID, Latitude, Longitude, and all available tags)
        csv_headers = ["ID", "Latitude", "Longitude"] + sorted(all_tags)

        # Save data to CSV
        with open("repair_shops.csv", "w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow(csv_headers)  # Write CSV headers

            # Process each shop and extract data
            for shop in data["elements"]:
                shop_id = shop.get("id", "N/A")
                latitude = shop.get("lat", "N/A")
                longitude = shop.get("lon", "N/A")
                tags = shop.get("tags", {})

                # Create row with default values
                row = [shop_id, latitude, longitude] + [tags.get(tag, "Not Specified") for tag in sorted(all_tags)]
                writer.writerow(row)

        print("✅ All repair shop data saved to repair_shops.csv")

    else:
        print("❌ No repair shop data found in this region.")

except requests.exceptions.RequestException as e:
    print(f"❌ Error fetching data: {e}")
except json.JSONDecodeError:
    print("❌ Failed to decode JSON response from OpenStreetMap API.")
