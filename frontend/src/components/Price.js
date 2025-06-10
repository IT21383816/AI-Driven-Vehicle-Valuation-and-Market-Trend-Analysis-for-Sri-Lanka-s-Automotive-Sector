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




function Price() {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [yom, setYom] = useState('');
    const [transmission, setTransmission] = useState('');
    const [km, setKm] = useState('');
    const [fuel, setFuel] = useState('');
    const [seller_type, setSeller_type] = useState('');
    const [owner, setOwner] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name || !yom || !transmission || !km || !fuel || !seller_type || !owner ) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setError('');
        setPrediction(null);

        const data = JSON.stringify({
            name, year: parseInt(yom), km_driven: parseInt(km), fuel:fuel,seller_type: seller_type, transmission, owner: parseInt(owner)
        });
        console.log(data);
        await axios
            .post('http://127.0.0.1:1111/v_price', data, {
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
                    <h2 style={{ margin: 0 }}>Vehicle Price</h2>
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
                        Vehicle Price Prediction
                    </h1>
                </div>


                <form
                    onSubmit={handleSubmit}
                    style={{
                        width:'80%',
                        marginBottom: '20px',
                        padding: '20px',
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        display: 'inline-block',
                    }}
                >
                    <label>Name</label>
                    <br />
                <select value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required>
                    <option value="">Select Name</option>
                    <option value="0">Suzuki</option>
                    <option value="1">Toyota</option>
                </select>
                <br />
                
                <label>Year of Manufacture (YOM)</label>
                <br />
                <input type="number" value={yom} onChange={(e) => setYom(e.target.value)} style={inputStyle} required />
                <br />
                
                <label>Transmission</label>
                <br />
                <select value={transmission} onChange={(e) => setTransmission(e.target.value)} style={inputStyle} required>
                    <option value="">Select Transmission</option>
                    <option value="0">Automatic</option>
                    <option value="1">Manual</option>
                </select>
                <br />
                
                <label>Km</label>
                <br />
                <input type="number" value={km} onChange={(e) => setKm(e.target.value)} style={inputStyle} required />
                <br />
                
                <label>Fuel Type</label>
                <br />
                <select value={fuel} onChange={(e) => setFuel(e.target.value)} style={inputStyle} required>
                    <option value="">Select Fuel Type</option>
                    <option value="0">Diesel</option>
                    <option value="1">Hybrid</option>
                    <option value="2">Petrol</option>
                </select>
                <br />
                
                <label>Seller Type</label>
                <br />
                <select value={seller_type} onChange={(e) => setSeller_type(e.target.value)} style={inputStyle} required>
                    <option value="">Select Seller Type</option>
                    <option value="0">Individual</option>
                    <option value="1">Trustmark Dealer</option>
                    <option value="2">Dealer</option>
                </select>
                <br />
                
                <label>Owner</label>
                <br />
                <select value={owner} onChange={(e) => setOwner(e.target.value)} style={inputStyle} required>
                <option value="">Select Owner Type</option>
                    <option value="0">Third Owner</option>
                    <option value="1">Second Owner</option>
                    <option value="2">First Owner</option>
                </select>
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
                            <strong>Price:</strong>{' '}
                            <span style={{ color: '#147d30' }}>
                                {prediction.price}
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

export default Price;