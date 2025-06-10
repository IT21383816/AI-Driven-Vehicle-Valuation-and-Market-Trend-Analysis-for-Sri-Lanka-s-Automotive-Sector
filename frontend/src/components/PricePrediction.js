import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import logo from './ui_images/logo.png';
import Sidebar from './sidebar';
import Footer from './Footer';

// Fix default Leaflet icon issue in React
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PricePrediction() {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [yom, setYom] = useState('');
    const [transmission, setTransmission] = useState('');
    const [mileage, setMileage] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [color, setColor] = useState('');
    const [engineCC, setEngineCC] = useState('');
    const [bodyType, setBodyType] = useState('');
    const [month, setMonth] = useState('');
    const [location, setLocation] = useState('');
    const [other, setOther] = useState(null);
    const [m1, setM1] = useState(null);
    const [m2, setM2] = useState(null);
    const [m3, setM3] = useState(null);
    const [chartData, setChartData] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!brand || !model || !yom || !transmission || !mileage || !fuelType || !color || !engineCC || !bodyType || !month || !location) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setError('');
        setPrediction(null);
        setOther(null);
        setM1(null);
        setM2(null);
        setM3(null);
        setChartData(null);

        const data = JSON.stringify({
            brand, model, yom: parseInt(yom), transmission, mileage: parseInt(mileage), fuel_type: fuelType, color, engine: parseInt(engineCC), body_type: bodyType, month: parseInt(month), location
        });
        
        await axios
            .post('http://127.0.0.1:1111/price', data, {
                headers: { "Content-Type": "application/json" },
            })
            .then(async (res) => {
                setPrediction(res.data);
            });

        if (brand == 0) {
            const data = JSON.stringify({
                brand: 0, model, yom: parseInt(yom), transmission, mileage: parseInt(mileage), fuel_type: fuelType, color, engine: parseInt(engineCC), body_type: bodyType, month: parseInt(month), location
            });
            await axios
                .post('http://127.0.0.1:1111/price', data, {
                    headers: { "Content-Type": "application/json" },
                })
                .then(async (res) => {
                    setOther(res.data);
                });
            
            const months = [4, 5, 6]; // Example months for future predictions
            const data1 = JSON.stringify({
                brand: 1, model, yom: parseInt(yom), transmission, mileage: parseInt(mileage), fuel_type: fuelType, color, engine: parseInt(engineCC), body_type: bodyType, month: months[0], location
            });
            await axios
                .post('http://127.0.0.1:1111/price', data1, {
                    headers: { "Content-Type": "application/json" },
                })
                .then(async (res) => {
                    setM1(res.data);
                });
            
            const data2 = JSON.stringify({
                brand: 1, model, yom: parseInt(yom), transmission, mileage: parseInt(mileage), fuel_type: fuelType, color, engine: parseInt(engineCC), body_type: bodyType, month: months[1], location
            });
            await axios
                .post('http://127.0.0.1:1111/price', data2, {
                    headers: { "Content-Type": "application/json" },
                })
                .then(async (res) => {
                    setM2(res.data);
                });
            
            const data3 = JSON.stringify({
                brand: 1, model, yom: parseInt(yom), transmission, mileage: parseInt(mileage), fuel_type: fuelType, color, engine: parseInt(engineCC), body_type: bodyType, month: months[2], location
            });
            await axios
                .post('http://127.0.0.1:1111/price', data3, {
                    headers: { "Content-Type": "application/json" },
                })
                .then(async (res) => {
                    setM3(res.data);
                    setLoading(false);
                });
        } else {
            const data = JSON.stringify({
                brand: 1, model, yom: parseInt(yom), transmission, mileage: parseInt(mileage), fuel_type: fuelType, color, engine: parseInt(engineCC), body_type: bodyType, month: parseInt(month), location
            });
            await axios
                .post('http://127.0.0.1:1111/price', data, {
                    headers: { "Content-Type": "application/json" },
                })
                .then(async (res) => {
                    setOther(res.data);
                });
            
            const months = [4, 5, 6]; // Example months for future predictions
            const data1 = JSON.stringify({
                brand: 0, model, yom: parseInt(yom), transmission, mileage: parseInt(mileage), fuel_type: fuelType, color, engine: parseInt(engineCC), body_type: bodyType, month: months[0], location
            });
            await axios
                .post('http://127.0.0.1:1111/price', data1, {
                    headers: { "Content-Type": "application/json" },
                })
                .then(async (res) => {
                    setM1(res.data);
                });
            
            const data2 = JSON.stringify({
                brand: 0, model, yom: parseInt(yom), transmission, mileage: parseInt(mileage), fuel_type: fuelType, color, engine: parseInt(engineCC), body_type: bodyType, month: months[1], location
            });
            await axios
                .post('http://127.0.0.1:1111/price', data2, {
                    headers: { "Content-Type": "application/json" },
                })
                .then(async (res) => {
                    setM2(res.data);
                });
            
            const data3 = JSON.stringify({
                brand: 0, model, yom: parseInt(yom), transmission, mileage: parseInt(mileage), fuel_type: fuelType, color, engine: parseInt(engineCC), body_type: bodyType, month: months[2], location
            });
            await axios
                .post('http://127.0.0.1:1111/price', data3, {
                    headers: { "Content-Type": "application/json" },
                })
                .then(async (res) => {
                    setM3(res.data);
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        if (prediction && m1 && m2 && m3) {
            setChartData({
                labels: ['Current Month', 'Next Month', '2 Months Later', '3 Months Later'],
                datasets: [
                    {
                        label: 'Predicted Price (LKR)',
                        data: [
                            prediction?.price || 0,
                            m1?.price || 0,
                            m2?.price || 0,
                            m3?.price || 0
                        ],
                        backgroundColor: [
                            'rgba(20, 125, 48, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(255, 99, 132, 0.6)'
                        ],
                        borderColor: [
                            'rgba(20, 125, 48, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            });
        }
    }, [prediction, m1, m2, m3]);

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

            <div className="body-container">
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
                        Vehicle Price Prediction
                    </h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    style={{
                        width: '80%',
                        marginBottom: '20px',
                        padding: '20px',
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        display: 'inline-block',
                    }}
                >
                    <label>Brand</label>
                    <br />
                    <select value={brand} onChange={(e) => setBrand(e.target.value)} style={inputStyle} required>
                        <option value="">Select Brand</option>
                        <option value="0">Suzuki</option>
                        <option value="1">Toyota</option>
                    </select>
                    <br />

                    <label>Model</label>
                    <br />
                    <select value={model} onChange={(e) => setModel(e.target.value)} style={inputStyle} required>
                        <option value="">Select Model</option>
                        <option value="0">Alto</option>
                        <option value="1">Aqua</option>
                        <option value="2">Every</option>
                        <option value="3">KDH</option>
                        <option value="4">Prius</option>
                        <option value="5">Wagon R</option>
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

                    <label>Mileage</label>
                    <br />
                    <input type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} style={inputStyle} required />
                    <br />

                    <label>Fuel Type</label>
                    <br />
                    <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} style={inputStyle} required>
                        <option value="">Select Fuel Type</option>
                        <option value="0">Diesel</option>
                        <option value="1">Hybrid</option>
                        <option value="2">Petrol</option>
                    </select>
                    <br />

                    <label>Color</label>
                    <br />
                    <select value={color} onChange={(e) => setColor(e.target.value)} style={inputStyle} required>
                        <option value="">Select Color</option>
                        <option value="0">Black</option>
                        <option value="1">Blue</option>
                        <option value="2">Gray</option>
                        <option value="3">Maroon</option>
                        <option value="4">Red</option>
                        <option value="5">Silver</option>
                        <option value="6">White</option>
                        <option value="7">Yellow</option>
                    </select>
                    <br />

                    <label>Engine CC</label>
                    <br />
                    <select value={engineCC} onChange={(e) => setEngineCC(e.target.value)} style={inputStyle} required>
                        <option value="">Select Engine CC</option>
                        <option value="660">660</option>
                        <option value="800">800</option>
                        <option value="1000">1000</option>
                        <option value="1200">1200</option>
                    </select>
                    <br />

                    <label>Body Type</label>
                    <br />
                    <select value={bodyType} onChange={(e) => setBodyType(e.target.value)} style={inputStyle} required>
                        <option value="">Select Body Type</option>
                        <option value="0">Hatchback</option>
                        <option value="1">LWB</option>
                        <option value="2">Micro Van</option>
                        <option value="3">Saloon</option>
                        <option value="4">Sedan</option>
                    </select>
                    <br />

                    <label>Month</label>
                    <br />
                    <select value={month} onChange={(e) => setMonth(e.target.value)} style={inputStyle} required>
                        {[...Array(12).keys()].map(i => <option key={i} value={i + 1}>{i + 1}</option>)}
                    </select>
                    <br />

                    <label>Location</label>
                    <br />
                    <select value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} required>
                        <option value="">Select Location</option>
                        <option value="7">Colombo</option>
                        <option value="10">Gampaha</option>
                        <option value="19">Kandy</option>
                        <option value="27">Kurunegala</option>
                        <option value="28">Malabe</option>
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
                            <span style={{ color: '#147d30', fontWeight: 'bold' }}>
                                LKR {prediction.price.toLocaleString()}
                            </span>
                        </p>
                    </div>
                )}

                {other && (
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
                        <h3>Other Brand Prediction</h3>
                        <p style={{ fontSize: '18px', color: '#555' }}>
                            <strong>Price:</strong>{' '}
                            <span style={{ color: '#147d30', fontWeight: 'bold' }}>
                                LKR {other.price.toLocaleString()}
                            </span>
                        </p>
                    </div>
                )}

                {chartData && (
                    <div
                        style={{
                            marginTop: '20px',
                            padding: '20px',
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            maxWidth: '800px',
                            margin: '20px auto'
                        }}
                    >
                        <h3>Price Trend Over Next Months</h3>
                        <div style={{ height: '400px', width: '100%' }}>
                            <Bar 
                                data={chartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        title: {
                                            display: true,
                                            text: 'Vehicle Price Prediction Trend',
                                            font: {
                                                size: 16
                                            }
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function(context) {
                                                    return 'LKR ' + context.raw.toLocaleString();
                                                }
                                            }
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: false,
                                            ticks: {
                                                callback: function(value) {
                                                    return 'LKR ' + value.toLocaleString();
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', flex: 1, margin: '0 5px' }}>
                                <h4>Next Month</h4>
                                <p style={{ color: '#147d30', fontWeight: 'bold' }}>LKR {m1.price.toLocaleString()}</p>
                            </div>
                            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', flex: 1, margin: '0 5px' }}>
                                <h4>2 Months Later</h4>
                                <p style={{ color: '#147d30', fontWeight: 'bold' }}>LKR {m2.price.toLocaleString()}</p>
                            </div>
                            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', flex: 1, margin: '0 5px' }}>
                                <h4>3 Months Later</h4>
                                <p style={{ color: '#147d30', fontWeight: 'bold' }}>LKR {m3.price.toLocaleString()}</p>
                            </div>
                        </div>
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

export default PricePrediction;