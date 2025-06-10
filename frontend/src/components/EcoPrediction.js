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




function EcoPrediction() {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [vehicleClass, setVehicleClass] = useState('');
    const [transmission, setTransmission] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [engineSize, setEngineSize] = useState('');
    const [cylinders, setCylinders] = useState('');
    const [fuelCity, setFuelCity] = useState('');
    const [fuelHwy, setFuelHwy] = useState('');
    const [fuelComb, setFuelComb] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!make || !model || !vehicleClass || !transmission || !fuelType || !engineSize || !cylinders || !fuelCity || !fuelHwy || !fuelComb) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setError('');
        setPrediction(null);

        const data = JSON.stringify({
            make: make,
            model: model,
            vehicle_class: vehicleClass,
            transmission: transmission,
            fuel_type: fuelType,
            engine_size: parseFloat(engineSize),
            cylinders: parseInt(cylinders),
            fuel_consumption_city: parseFloat(fuelCity),
            fuel_consumption_hwy: parseFloat(fuelHwy),
            fuel_consumption_comb: parseFloat(fuelComb)
        });
        console.log(data);
        await axios
            .post('http://127.0.0.1:1111/eco', data, {
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
                    <h2 style={{ margin: 0 }}>Vehicle Valuation Detection</h2>
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
                        Vehicle Eco-Friendly Check
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
                    <label>Make</label>
                    <br />
                    <select value={make} onChange={(e) => setMake(e.target.value)} style={inputStyle} required>
                        <option value="">Select Make</option>
                        <option value="0">ACURA</option>
                        <option value="1">TOYOTA</option>
                        <option value="2">HONDA</option>
                    </select>
                    <br />

                    <label>Model</label>
                    <br />
                    <select value={model} onChange={(e) => setModel(e.target.value)} style={inputStyle} required>
                        <option value="">Select Model</option>
                        <option value="0">ILX</option>
                        <option value="1">MDX</option>
                        <option value="2">RDX</option>
                    </select>
                    <br />

                    <label>Vehicle Class</label>
                    <br />
                    <select value={vehicleClass} onChange={(e) => setVehicleClass(e.target.value)} style={inputStyle} required>
                        <option value="">Select Vehicle Class</option>
                        <option value="0">COMPACT</option>
                        <option value="1">SUV</option>
                        <option value="2">MID-SIZE</option>
                    </select>
                    <br />

                    <label>Transmission</label>
                    <br />
                    <select value={transmission} onChange={(e) => setTransmission(e.target.value)} style={inputStyle} required>
                        <option value="">Select Transmission</option>
                        <option value="0">AS5</option>
                        <option value="1">M6</option>
                        <option value="2">AV7</option>
                    </select>
                    <br />

                    <label>Fuel Type</label>
                    <br />
                    <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} style={inputStyle} required>
                        <option value="">Select Fuel Type</option>
                        <option value="0">Diesel</option>
                        <option value="1">Petrol</option>
                    </select>
                    <br />

                    <label>Engine Size (L)</label>
                    <br />
                    <input
                        type="number"
                        step="0.1"
                        value={engineSize}
                        style={inputStyle}
                        onChange={(e) => setEngineSize(e.target.value)}
                        required
                    />
                    <br />

                    <label>Cylinders</label>
                    <br />
                    <input
                        type="number"
                        value={cylinders}
                        style={inputStyle}
                        onChange={(e) => setCylinders(e.target.value)}
                        required
                    />
                    <br />

                    <label>Fuel City (L/100 km)</label>
                    <br />
                    <input
                        type="number"
                        step="0.1"
                        value={fuelCity}
                        style={inputStyle}
                        onChange={(e) => setFuelCity(e.target.value)}
                        required
                    />
                    <br />

                    <label>Fuel Hwy (L/100 km)</label>
                    <br />
                    <input
                        type="number"
                        step="0.1"
                        style={inputStyle}
                        value={fuelHwy}
                        onChange={(e) => setFuelHwy(e.target.value)}
                        required
                    />
                    <br />

                    <label>Fuel Combined (L/100 km)</label>
                    <br />
                    <input
                        type="number"
                        step="0.1"
                        style={inputStyle}
                        value={fuelComb}
                        onChange={(e) => setFuelComb(e.target.value)}
                        required
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
                            <strong>CO2:</strong>{' '}
                            <span style={{ color: '#147d30' }}>
                                {prediction.co2}
                            </span>
                        </p>
                        <p style={{ fontSize: '18px', color: '#555' }}>
                            <strong>Fuel:</strong>{' '}
                            <span style={{ color: '#147d30' }}>
                                {(prediction.fuel * 1).toFixed(2)} KM / L
                            </span>
                        </p>
                        {
                            prediction.co2 > 0&&prediction.co2 <= 100 ? (<p>Low emissions, minimal environmental impact. Ideal for hybrid and electric vehicles.</p>) : null
                        }
                        {
                            prediction.co2 > 100&&prediction.co2 <= 200 ? (<p>Balanced emissions. Includes fuel-efficient petrol and diesel vehicles.</p>) : null
                        }
                        {
                            prediction.co2 > 200 ? (<p>High emissions, significant environmental impact. Typically includes older and larger engine vehicles.</p>) : null
                        }

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

export default EcoPrediction;
