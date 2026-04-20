import numpy as np
import tensorflow as tf
import os

# Sample training data (same structure as IsolationForest)
X = np.array([
    [120, 0, 1, 200],
    [130, 1, 0, 210],
    [110, 0, 1, 190],
    [115, 0, 0, 205],
    [125, 0, 1, 195],
    [118, 0, 0, 198],
    [122, 0, 0, 202],
    [119, 0, 1, 200]
], dtype=np.float32)

# Normalize
X = (X - X.min()) / (X.max() - X.min())

# Autoencoder model
input_dim = X.shape[1]

input_layer = tf.keras.layers.Input(shape=(input_dim,))
encoded = tf.keras.layers.Dense(8, activation="relu")(input_layer)
encoded = tf.keras.layers.Dense(4, activation="relu")(encoded)

decoded = tf.keras.layers.Dense(8, activation="relu")(encoded)
decoded = tf.keras.layers.Dense(input_dim, activation="sigmoid")(decoded)

autoencoder = tf.keras.Model(inputs=input_layer, outputs=decoded)

autoencoder.compile(optimizer="adam", loss="mse")

# Train
autoencoder.fit(X, X, epochs=50, batch_size=4, verbose=1)

# Save model
os.makedirs("models", exist_ok=True)
autoencoder.save("models/autoencoder.h5")

print("✅ Autoencoder model saved as models/autoencoder.h5")
