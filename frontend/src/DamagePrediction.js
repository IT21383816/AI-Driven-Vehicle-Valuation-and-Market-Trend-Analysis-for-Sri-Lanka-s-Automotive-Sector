import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import logo from '../src/ui_images/logo.png'; // Replace with the correct path to your logo file
import Sidebar from './sidebar'; // Import the Sidebar component
import Footer from './Footer'; // Import the Footer component


// Fix default Leaflet icon issue in React
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";



const customIcon = new L.Icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});




function DamagePrediction() {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [repairShops, setRepairShops] = useState([]); // Stores repair shop recommendations
    const [mapUrl, setMapUrl] = useState(null); // Stores map URL
    const [userLocation, setUserLocation] = useState(null);


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
// fetch repair shops
    const fetchRepairShops = async () => {
        if (!prediction) return;
        
        const { predicted_damage } = prediction;
        const latitude = 6.9149;  // Example coordinates
        const longitude = 79.9738;
    
        try {
            const response = await axios.post(
                'http://127.0.0.1:5000/recommend_repair',
                {
                    latitude,
                    longitude,
                    damage_type: predicted_damage
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            setRepairShops(response.data);
        } catch (error) {
            console.error('Error fetching repair shop recommendations:', error);
            setError('Error fetching repair shops. Please try again.');
        }
    };

    // Fetch the repair shop map
    const fetchRepairShopMap = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/generate_map');
            if (response.data.map_url) {
                setMapUrl(response.data.map_url);
                window.open(`http://127.0.0.1:5000${response.data.map_url}`, '_blank'); // Open map in new tab
            }
        } catch (error) {
            console.error('Error fetching map:', error);
            setError('Error generating repair shop map.');
        }
    };

    // Detect User's Location Automatically
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting user location:", error);
                    setError("Unable to get your location.");
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    }, []);


    return (
        <div
            style={{
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center',
                padding: '30px',
                backgroundColor: '#f9f9f9',
                minHeight: '100vh',
                marginLeft: '260px',
            }}
        >
             <Sidebar />
            {/* Header with Navigation Bar */}
            <header
                style={{
                    backgroundColor: '#147d30',
                    color: '#fff',
                    padding: '10px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ width: '50px', height: '50px', marginRight: '15px' }}
                    />
                    <h2 style={{ margin: 0 }}>Vehicle Damage Detection</h2>
                </div>
                <nav>
                    <ul
                        style={{
                            listStyle: 'none',
                            display: 'flex',
                            margin: 0,
                            padding: 0,
                        }}
                    >
                        <li style={{ margin: '0 10px' }}>
                            <a
                                href="#"
                                style={{
                                    color: '#fff',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                }}
                            >
                                Home
                            </a>
                        </li>
                        <li style={{ margin: '0 10px' }}>
                            <a
                                href="#about"
                                style={{
                                    color: '#fff',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                }}
                            >
                                About
                            </a>
                        </li>
                        <li style={{ margin: '0 10px' }}>
                            <a
                                href="#contact"
                                style={{
                                    color: '#fff',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                }}
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Main Body */}
            <div className="body-container">
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    //marginLeft: '260px',
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

                    {/* "Find Repair Shops" Button */}
                    <button onClick={fetchRepairShops} style={{ backgroundColor: '#007BFF', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Find Nearby Repair Shops
                        </button>
                        <button onClick={fetchRepairShopMap} style={{
                            backgroundColor: '#FF9800',
                            color: '#fff',
                            padding: '10px 15px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginLeft: '10px',
                        }}>
                            View Repair Shops on Map
                        </button>
                </div>
            )}

            {/* Display Recommended Repair Shops */}
            {repairShops.length > 0 && (
                    <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                        <h2>Recommended Repair Shops</h2>
                        <ul>
                            {repairShops.map((shop, index) => (
                                <li key={index}>{shop.name} - {shop.distance.toFixed(2)} km away - {shop["addr:city"]}</li>
                            ))}
                        </ul>
                    </div>
          )}

          {/* Small Map Display */}
          {userLocation && (
                    <MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={12} style={{ height: "400px", width: "100%", marginTop: "20px", borderRadius: "10px" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {/* User's Location Marker */}
                        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={customIcon}>
                            <Popup>📍 Your Location</Popup>
                        </Marker>

                        {/* Repair Shops Markers */}
                        {repairShops.map((shop, index) => (
                            <Marker key={index} position={[shop.Latitude, shop.Longitude]} icon={customIcon}>
                                <Popup>{shop.name || "Unknown"} - {shop["addr:city"] || "Unknown"}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            <Footer />
            </div>
        </div>
    );
}

export default DamagePrediction;
