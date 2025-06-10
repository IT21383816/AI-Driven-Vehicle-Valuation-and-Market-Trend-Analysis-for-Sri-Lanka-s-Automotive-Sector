import pandas as pd
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models # type: ignore
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

# Step 1: Load and preprocess the data
df = pd.read_csv('annotations_cost.csv')  # Assuming the CSV file has damage types and repair costs

# Initialize lists to store images and repair costs
images = []
repair_costs = []  # Repair cost values

# Load images and corresponding repair costs
for _, row in df.iterrows():
    image_path = row['filename']
    repair_cost = row['cost']  # The repair cost

    # Read the image using OpenCV
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error loading image: {image_path}")
        continue
    
    # Resize image to a consistent size (e.g., 224x224)
    image = cv2.resize(image, (224, 224))
    # Normalize pixel values to [0, 1]
    image = image / 255.0
    
    # Append the image and repair cost to the lists
    images.append(image)
    repair_costs.append(repair_cost)

# Convert lists to numpy arrays
images = np.array(images)
repair_costs = np.array(repair_costs)

# Step 2: Split the data into training and validation sets
X_train, X_val, y_train, y_val = train_test_split(images, repair_costs, test_size=0.2, random_state=42)

print(f"Training data shape: {X_train.shape}, {y_train.shape}")
print(f"Validation data shape: {X_val.shape}, {y_val.shape}")

# Step 3: Define the model
# Load the MobileNetV2 model pre-trained on ImageNet without the top (classification) layers
base_model = tf.keras.applications.MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')

# Freeze the base model layers to prevent updating during initial training
base_model.trainable = False

# Add custom layers for the repair cost prediction (regression task)
model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dense(1, activation='linear', name='repair_cost')  # Output layer for repair cost (regression)
])

# Compile the model
model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mae'])

# Step 4: Train the model
history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=10,
    batch_size=32
)

# Step 5: Evaluate the model
loss, mae = model.evaluate(X_val, y_val)
print(f"Validation Loss: {loss}")
print(f"Validation MAE (Mean Absolute Error): {mae}")

# Step 6: Visualize the training process
plt.figure(figsize=(12, 8))
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Training and Validation Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()
plt.grid(True)
plt.show()

plt.figure(figsize=(12, 8))
plt.plot(history.history['mae'], label='Training MAE')
plt.plot(history.history['val_mae'], label='Validation MAE')
plt.title('Training and Validation MAE')
plt.xlabel('Epochs')
plt.ylabel('MAE')
plt.legend()
plt.grid(True)
plt.show()

# Step 7: Make predictions
sample_image = X_val[0]  # Use the first image from the validation set
true_cost = y_val[0]  # True repair cost for the sample image

# Predict the repair cost for the sample image
predicted_cost = model.predict(np.expand_dims(sample_image, axis=0))
print(f"True Repair Cost: {true_cost}")
print(f"Predicted Repair Cost: {predicted_cost[0][0]}")

# Visualize the image and the predicted vs true repair cost
plt.figure(figsize=(8, 8))
plt.imshow(sample_image)
plt.title(f"True Cost: {true_cost}, Predicted Cost: {predicted_cost[0][0]:.2f}")
plt.axis('off')
plt.show()

# Step 8: Save the model for later use
model.save('repair_cost_estimation_model.keras')


