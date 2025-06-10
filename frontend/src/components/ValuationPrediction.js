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




function ValuationPrediction() {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [repairShops, setRepairShops] = useState([]);
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);

    const onChangeHandler1 = (event) => {
        const data = new FormData()
        data.append('file', event.target.files[0])
        axios.post("http://localhost:4000/file/upload", data, {
        }).then(res => {
            setImage1(res.data.filename)
        })
    }
    const onChangeHandler2 = (event) => {
        const data = new FormData()
        data.append('file', event.target.files[0])
        axios.post("http://localhost:4000/file/upload", data, {
        }).then(res => {
            setImage2(res.data.filename)
        })
    }
    const onChangeHandler3 = (event) => {
        const data = new FormData()
        data.append('file', event.target.files[0])
        axios.post("http://localhost:4000/file/upload", data, {
        }).then(res => {
            setImage3(res.data.filename)
        })
    }
    const onChangeHandler4 = (event) => {
        const data = new FormData()
        data.append('file', event.target.files[0])
        axios.post("http://localhost:4000/file/upload", data, {
        }).then(res => {
            setImage4(res.data.filename)
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!image1) {
            setError('Please select an image front');
            return;
        }

        if (!image2) {
            setError('Please select an image back');
            return;
        }

        if (!image3) {
            setError('Please select an image inside');
            return;
        }

        if (!image4) {
            setError('Please select an image outside');
            return;
        }

        setLoading(true);
        setError('');
        setPrediction(null);

        const data = JSON.stringify({
            url1: image1, url2: image2, url3: image3, url4: image4
        });
        console.log(data);
        await axios
            .post('http://127.0.0.1:1111/valuation', data, {
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
                        Vehicle Valuation
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
                ><label>front image</label>
                    <br />
                    <input
                        type="file"
                        onChange={onChangeHandler1}
                        style={{
                            marginBottom: '10px',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                    <br />
                    <label>back image</label>
                    <br />
                    <input
                        type="file"
                        onChange={onChangeHandler2}
                        style={{
                            marginBottom: '10px',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                    <br />
                    <label>inside image</label>
                    <br />
                    <input
                        type="file"
                        onChange={onChangeHandler3}
                        style={{
                            marginBottom: '10px',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                    <br />
                    <label>outside image</label>
                    <br />
                    <input
                        type="file"
                        onChange={onChangeHandler4}
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

                {image1 && (
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
                        <h2 style={{ color: '#333' }}>front image:</h2>
                        <img
                            src={"http://localhost:4000/" + image1}
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
                {image2 && (
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
                        <h2 style={{ color: '#333' }}>back image:</h2>
                        <img
                            src={"http://localhost:4000/" + image2}
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
                {image3 && (
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
                        <h2 style={{ color: '#333' }}>inside image:</h2>
                        <img
                            src={"http://localhost:4000/" + image3}
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
                {image4 && (
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
                        <h2 style={{ color: '#333' }}>outside image:</h2>
                        <img
                            src={"http://localhost:4000/" + image4}
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
                            <strong>front image result:</strong>{' '}
                            <span style={{ color: '#147d30' }}>
                                {prediction.res1}
                            </span>
                        </p>
                        <p style={{ fontSize: '18px', color: '#555' }}>
                            <strong>Confidence:</strong>{' '}
                            <span style={{ color: '#147d30' }}>
                                {(prediction.accuracy1 * 1).toFixed(2)}
                            </span>
                        </p>
                        <p style={{ fontSize: '18px', color: '#555' }}>
                            <strong>back image result:</strong>{' '}
                            <span style={{ color: '#147d30' }}>
                                {prediction.res2}
                            </span>
                        </p>
                        <p style={{ fontSize: '18px', color: '#555' }}>
                            <strong>Confidence:</strong>{' '}
                            <span style={{ color: '#147d30' }}>
                                {(prediction.accuracy2 * 1).toFixed(2)}
                            </span>
                        </p>
                        <p style={{ fontSize: '18px', color: '#555' }}>
                            <strong>inside image result:</strong>{' '}
                            <span style={{ color: '#147d30' }}>
                                {prediction.res3}
                            </span>
                        </p>
                        <p style={{ fontSize: '18px', color: '#555' }}>
                            <strong>Confidence:</strong>{' '}
                            <span style={{ color: '#147d30' }}>
                                {(prediction.accuracy3 * 1).toFixed(2)}
                            </span>
                        </p>
                        <p style={{ fontSize: '18px', color: '#555' }}>
                            <strong>outside image result:</strong>{' '}
                            <span style={{ color: '#147d30' }}>
                                {prediction.res4}
                            </span>
                        </p>
                        <p style={{ fontSize: '18px', color: '#555' }}>
                            <strong>Confidence:</strong>{' '}
                            <span style={{ color: '#147d30' }}>
                                {(prediction.accuracy4 * 1).toFixed(2)}
                            </span>
                        </p>

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

                <Footer />
            </div>
        </div>
    );
}

export default ValuationPrediction;
