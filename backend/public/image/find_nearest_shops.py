import pandas as pd
from geopy.distance import geodesic

# Load repair shop data
try:
    repair_shops = pd.read_csv("repair_shops.csv")

    # Ensure latitude & longitude are numeric
    repair_shops["Latitude"] = pd.to_numeric(repair_shops["Latitude"], errors="coerce")
    repair_shops["Longitude"] = pd.to_numeric(repair_shops["Longitude"], errors="coerce")

    # Drop rows with missing coordinates
    repair_shops = repair_shops.dropna(subset=["Latitude", "Longitude"])

except FileNotFoundError:
    print("❌ Error: repair_shops.csv file not found!")
    exit()
except Exception as e:
    print(f"❌ Error loading CSV: {e}")
    exit()

def get_nearest_shops(user_location, num_results=3):
    """Finds the nearest repair shops based on user location."""
    if repair_shops.empty:
        print("❌ No repair shop data available.")
        return None

    try:
        # Calculate distance for each shop
        repair_shops["distance"] = repair_shops.apply(
            lambda row: geodesic(user_location, (row["Latitude"], row["Longitude"])).km, axis=1
        )

        # Sort by nearest distance
        nearest_shops = repair_shops.sort_values(by="distance").head(num_results)

        return nearest_shops[["name", "Latitude", "Longitude", "distance"]]

    except Exception as e:
        print(f"❌ Error processing distances: {e}")
        return None

# Example usage: Finding shops near Colombo (6.9149, 79.9736)
user_location = (6.9149, 79.9736)
nearest_shops = get_nearest_shops(user_location)

if nearest_shops is not None:
    print("\n✅ Nearest Repair Shops:")
    print(nearest_shops)
