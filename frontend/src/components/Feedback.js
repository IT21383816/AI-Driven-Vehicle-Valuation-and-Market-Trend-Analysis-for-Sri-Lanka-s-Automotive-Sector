import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import logo from './ui_images/logo.png'; // Replace with the correct path to your logo file
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




function Feedback() {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [text, setText] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!text) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setError('');
        setPrediction(null);

        const data = JSON.stringify({
            text: text
        });
        console.log(data);
        await axios
            .post('http://127.0.0.1:1111/nlp_model', data, {
                headers: { "Content-Type": "application/json" },
            })
            .then(async (res) => {
                console.log(res.data);
                setPrediction(res.data);
                setLoading(false);
            });
    };


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
                    <h2 style={{ margin: 0 }}>Vehicle Customer Feedback</h2>
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
                        Vehicle Feedback
                    </h1> 
                </div>


                <form
                    onSubmit={handleSubmit}
                    style={{
                        width:'90%',
                        marginBottom: '20px',
                        padding: '20px',
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        display: 'inline-block',
                    }}
                >
                    <label>Text</label>
                    <br />
                    <textarea value={text} onChange={(e) => setText(e.target.value)} style={inputStyle} required>
                    </textarea>
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
                            marginTop: '10px',
                        }}
                    >
                        {loading ? 'Predicting...' : 'Submit'}
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


                {error && (
                    <p style={{ color: 'red', fontSize: '16px', marginTop: '20px' }}>
                        {error}
                    </p>
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
                        }}
                    >
                        <h3>Prediction Result</h3>
                        <p style={{ fontSize: '18px', color: '#555' }}>
                            <strong>Feedback Rating:</strong>{' '}
                            <span style={{ color: '#147d30' }}>
                                {prediction.res} / 5
                            </span>
                        </p>

                    </div>
                )}
                <Footer />
            </div>
        </div>
    );
}

const inputStyle = {
    width: '94%',
    padding: '10px',
    marginTop: '5px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
};

export default Feedback;
