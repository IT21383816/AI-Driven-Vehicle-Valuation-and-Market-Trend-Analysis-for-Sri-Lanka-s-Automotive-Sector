import React, { useState } from 'react';
import axios from 'axios';
import logo from '../src/ui_images/logo.png'; // Replace with the correct path to your logo file

function DamagePrediction() {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle file upload
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);

            // Generate a preview of the uploaded image
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Send the image to the backend for prediction
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!image) {
            setError('Please select an image first');
            return;
        }

        setLoading(true);
        setError('');
        setPrediction(null);

        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Set the prediction results
            setPrediction(response.data);
        } catch (err) {
            setError('Error predicting the damage. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center',
                padding: '30px',
                backgroundColor: '#f9f9f9',
                minHeight: '100vh',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                }}
            >
                <img
                    src={logo}
                    alt="Logo"
                    style={{
                        width: '170px',
                        height: '170px',
                        marginRight: '50px',
                    }}
                />
                <h1 style={{ color: '#147d30', marginBottom: '20px' }}>
                    Vehicle Damage Detection and Repair Cost Estimation
                </h1>
            </div>

            <form
                onSubmit={handleSubmit}
                style={{
                    marginBottom: '20px',
                    padding: '20px',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    display: 'inline-block',
                }}
            >
                <input
                    type="file"
                    onChange={handleFileChange}
                    style={{
                        marginBottom: '10px',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                    }}
                />
                <br />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    {loading ? 'Predicting...' : 'Submit Image'}
                </button>
            </form>

            {error && (
                <p
                    style={{
                        color: 'red',
                        fontSize: '16px',
                        marginTop: '20px',
                    }}
                >
                    {error}
                </p>
            )}

            {imagePreview && (
                <div
                    style={{
                        marginTop: '20px',
                        padding: '20px',
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        display: 'inline-block',
                        marginLeft: '40px',
                    }}
                >
                    <h2 style={{ color: '#333' }}>Uploaded Image:</h2>
                    <img
                        src={imagePreview}
                        alt="Uploaded preview"
                        style={{
                            width: '300px',
                            height: 'auto',
                            borderRadius: '10px',
                            border: '2px solid #4CAF50',
                        }}
                    />
                </div>
            )}

            {prediction && (
                <div
                    style={{
                        marginTop: '20px',
                        padding: '20px',
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        display: 'inline-block',
                    }}
                >
                    <h2 style={{ color: '#333' }}>Prediction Result:</h2>
                    <p style={{ fontSize: '18px', color: '#555' }}>
                        <strong>Damage Type:</strong>{' '}
                        <span style={{ color: '#147d30' }}>
                            {prediction.predicted_damage}
                        </span>
                    </p>
                    <p style={{ fontSize: '18px', color: '#555' }}>
                        <strong>Confidence:</strong>{' '}
                        <span style={{ color: '#147d30' }}>
                            {prediction.confidence.toFixed(2)}
                        </span>
                    </p>
                    <p style={{ fontSize: '18px', color: '#555' }}>
                        <strong>Bounding Box:</strong>{' '}
                        <span style={{ color: '#4CAF50' }}>
                            {JSON.stringify(prediction.predicted_bbox)}
                        </span>
                    </p>
                    <p style={{ fontSize: '18px', color: '#555' }}>
                        <strong>Estimated Repair Cost:</strong>{' '}
                        <span style={{ color: '#ff5722' }}>
                            Rs.{prediction.estimated_repair_cost.toFixed(2)}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}

export default DamagePrediction;
