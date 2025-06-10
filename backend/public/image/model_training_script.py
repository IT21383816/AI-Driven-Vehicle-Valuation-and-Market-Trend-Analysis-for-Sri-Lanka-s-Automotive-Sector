import pandas as pd
import cv2
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow.keras import layers, models # type: ignore
import matplotlib.pyplot as plt

# Step 1: Load and preprocess data
# Load the annotations CSV file
df = pd.read_csv('annotations.csv')

# Initialize empty lists to store images, bounding boxes, and damage labels
images = []
bboxes = []
damage_labels = []  # List for storing encoded damage labels

# Encode the damage labels (e.g., 'door_dent', 'glass_shatter', etc.) into integer labels
damage_encoder = LabelEncoder()
df['encoded_damage'] = damage_encoder.fit_transform(df['damage_type'])

# Iterate over the dataframe and load each image and its corresponding bounding box and damage label
for _, row in df.iterrows():
    image_path = row['filename']  # Get the image file path
    bbox = [row['xmin'], row['ymin'], row['xmax'], row['ymax']]  # Get bounding box coordinates
    damage_label = row['encoded_damage']  # Get the encoded damage label
    
    # Read the image using OpenCV
    image = cv2.imread(image_path)
    if image is None:  # If the image cannot be loaded, skip it
        print(f"Error loading image: {image_path}")
        continue
    
    # Resize the image to a consistent size (e.g., 224x224 pixels)
    image = cv2.resize(image, (224, 224))
    # Normalize pixel values to be between 0 and 1
    image = image / 255.0
    
    # Append the preprocessed image, bounding box, and damage label to the lists
    images.append(image)
    bboxes.append(bbox)
    damage_labels.append(damage_label)

# Convert lists to numpy arrays
images = np.array(images)
bboxes = np.array(bboxes)
damage_labels = np.array(damage_labels)

# Split the data into training and validation sets
X_train, X_val, bbox_train, bbox_val, label_train, label_val = train_test_split(
    images, bboxes, damage_labels, test_size=0.2, random_state=42
)

print("Data loaded and preprocessed successfully.")
print(f"Training data shape: {X_train.shape}, {bbox_train.shape}, {label_train.shape}")
print(f"Validation data shape: {X_val.shape}, {bbox_val.shape}, {label_val.shape}")

# Step 2: Define the model
# Load MobileNetV2 pre-trained on ImageNet
base_model = tf.keras.applications.MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')

# Freeze the base model layers
base_model.trainable = False

# Define the bounding box regression branch
bbox_branch = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dense(4, name='bbox_output')  # Output for bounding box (xmin, ymin, xmax, ymax)
])

# Define the damage detection branch (multi-class classification)
damage_branch = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dense(len(np.unique(damage_labels)), activation='softmax', name='damage_output')  # Output for damage categories
])

# Combine the two branches using the Functional API
input_layer = tf.keras.Input(shape=(224, 224, 3))
shared_features = base_model(input_layer, training=False)

# Branch outputs
bbox_output = layers.GlobalAveragePooling2D()(shared_features)
bbox_output = layers.Dense(128, activation='relu')(bbox_output)
bbox_output = layers.Dense(4, name='bbox_output')(bbox_output)

damage_output = layers.GlobalAveragePooling2D()(shared_features)
damage_output = layers.Dense(128, activation='relu')(damage_output)
damage_output = layers.Dense(len(np.unique(damage_labels)), activation='softmax', name='damage_output')(damage_output)

# Combine into a single model
model = tf.keras.Model(inputs=input_layer, outputs=[bbox_output, damage_output])

# Compile the model
model.compile(
    optimizer='adam',
    loss={'bbox_output': 'mse', 'damage_output': 'sparse_categorical_crossentropy'},
    metrics={'bbox_output': 'mse', 'damage_output': 'accuracy'}
)

# Print the model summary
model.summary()

# Step 3: Train the model
# Train the model using training data and validate it using validation data
history = model.fit(
    X_train, {'bbox_output': bbox_train, 'damage_output': label_train},
    validation_data=(X_val, {'bbox_output': bbox_val, 'damage_output': label_val}),
    epochs=10, batch_size=32
)

# Step 4: Visualize Training and Validation Loss
plt.figure(figsize=(12, 8))
plt.plot(history.history['bbox_output_loss'], label='BBox Loss (Train)')
plt.plot(history.history['val_bbox_output_loss'], label='BBox Loss (Validation)')
plt.plot(history.history['damage_output_loss'], label='Damage Loss (Train)')
plt.plot(history.history['val_damage_output_loss'], label='Damage Loss (Validation)')
plt.title('Training and Validation Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()
plt.grid(True)
plt.show()

# Step 5: Evaluate the model
losses = model.evaluate(X_val, {'bbox_output': bbox_val, 'damage_output': label_val})
print(f"Validation losses: {losses}")

# Step 6: Visualize Predictions
sample_image = X_val[0]  # Get the first image from the validation set
true_bbox = bbox_val[0]  # Get the corresponding true bounding box coordinates
true_label = label_val[0]  # Get the true damage label

# Make predictions for this image
pred_bbox, pred_label = model.predict(np.expand_dims(sample_image, axis=0))

# Plot the sample image with true and predicted bounding boxes
plt.figure(figsize=(12, 8))
plt.imshow(sample_image)
plt.gca().add_patch(plt.Rectangle(
    (true_bbox[0], true_bbox[1]), true_bbox[2] - true_bbox[0], true_bbox[3] - true_bbox[1],
    linewidth=2, edgecolor='green', facecolor='none', label='True Bounding Box'))
plt.gca().add_patch(plt.Rectangle(
    (pred_bbox[0, 0], pred_bbox[0, 1]), pred_bbox[0, 2] - pred_bbox[0, 0], pred_bbox[0, 3] - pred_bbox[0, 1],
    linewidth=2, edgecolor='red', facecolor='none', label='Predicted Bounding Box'))
plt.title(f'Sample Image with Bounding Boxes (Damage: {damage_encoder.inverse_transform([pred_label.argmax()])[0]})')
plt.legend()
plt.grid(True)
plt.show()

# Step 7: Fine-tune the model
base_model.trainable = True  # Unfreeze the base model

# Recompile with a lower learning rate for fine-tuning
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
    loss={'bbox_output': 'mse', 'damage_output': 'sparse_categorical_crossentropy'},
    metrics={'bbox_output': 'mse', 'damage_output': 'accuracy'}
)

# Continue training
model.fit(
    X_train, {'bbox_output': bbox_train, 'damage_output': label_train},
    validation_data=(X_val, {'bbox_output': bbox_val, 'damage_output': label_val}),
    epochs=10, batch_size=32
)

# Step 8: Save the final model
model.save('vehicle_damage_detection_final.keras')
print("Final model saved as vehicle_damage_detection_final.keras")
