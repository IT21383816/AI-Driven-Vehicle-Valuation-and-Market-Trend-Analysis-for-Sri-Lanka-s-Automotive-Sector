import os
import glob
import pandas as pd
import xml.etree.ElementTree as ET

def xml_to_csv(path):
    xml_list = []  # List to hold annotation data
    for xml_file in glob.glob(path + "/*.xml"):
        print(f"Processing file: {xml_file}")  # Debugging: Print each file being processed
        try:
            tree = ET.parse(xml_file)  # Parse XML file
            root = tree.getroot()  # Get the root of the XML tree

            # Define the recognized damage types (you can add more here if needed)
            damage_types = [
                "door_dent", "glass_shatter", "door_scratch", "bumper_dent", 
                "tail_lamp", "head_lamp", "bumper_scratch", "severe_damage", 
                "front_damage", "tire_damage", "side_damage"
            ]

             # Default damage label is 0 (no damage)
            damage_label = "No_Damage"

            # Ensure the XML contains the expected elements
            for member in root.findall("object"):
                class_name = member.find("name").text if member.find("name") is not None else "Unknown"
                
               # Check if the class_name matches any of the recognized damage types
                if class_name in damage_types:
                    damage_label = class_name  # Assign the corresponding damage type
                
                value = (
                    root.find("filename").text if root.find("filename") is not None else "Unknown",  # Image filename (default to "Unknown" if not found)
                    int(root.find("size/width").text) if root.find("size/width") is not None else 0,  # Image width (default to 0 if not found)
                    int(root.find("size/height").text) if root.find("size/height") is not None else 0,  # Image height (default to 0 if not found)
                    class_name,  # Object class (e.g., "front_damage")
                    int(member.find("bndbox/xmin").text) if member.find("bndbox/xmin") is not None else 0,  # Bounding box xmin
                    int(member.find("bndbox/ymin").text) if member.find("bndbox/ymin") is not None else 0,  # Bounding box ymin
                    int(member.find("bndbox/xmax").text) if member.find("bndbox/xmax") is not None else 0,  # Bounding box xmax
                    int(member.find("bndbox/ymax").text) if member.find("bndbox/ymax") is not None else 0,  # Bounding box ymax
                    damage_label  # Add the damage label (1 if damage detected, else 0)
                )
                xml_list.append(value)  # Append data to the list
        except Exception as e:
            print(f"Error processing file {xml_file}: {e}")  # Handle parsing errors gracefully

    # Define column names for the CSV
    column_name = [
        "filename",
        "width",
        "height",
        "class",
        "xmin",
        "ymin",
        "xmax",
        "ymax",
        "damage_type"  # Damage type (e.g., "front_damage", "door_scratch", etc.)
    ]
    
    # Convert the list to a DataFrame
    return pd.DataFrame(xml_list, columns=column_name)

def main():
    # Update the path to the location where your XML files are stored
    # Replace the path below with the actual directory where your XML files are located
    image_path = r"C:\Users\neth pc\Desktop\research\Project\AI-Driven-Vehicle-Valuation-and-Market-Trend-Analysis-for-Sri-Lanka-s-Automotive-Sector\image"
    
    # Convert XML annotations to CSV
    print(f"Converting XML files in {image_path}...")
    xml_df = xml_to_csv(image_path)
    
    # Save the CSV file to the Desktop or another directory where you have write permissions
    output_file = r"C:\Users\neth pc\Desktop\research\Project\AI-Driven-Vehicle-Valuation-and-Market-Trend-Analysis-for-Sri-Lanka-s-Automotive-Sector\image\annotations.csv"
    xml_df.to_csv(output_file, index=False)
    print(f"Successfully converted XML to CSV. File saved as {output_file}")

if __name__ == "__main__":
    main()
