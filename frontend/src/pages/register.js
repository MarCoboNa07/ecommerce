import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import google from "../components/img/google.png";
import apple from "../components/img/apple.png";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../components/css/register.css";

function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);

    // Funzione che verifica quando la dimensione dello schermo è minore di 800px
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 800);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Funzione che permette di modificare gli input
    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    // Funzione che invia una richiesta al server Node.js e restituisce la risposta
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post('https://ecommerce-vscs.onrender.com/api/register', formData); // Risposta del server

            // Salva i token JWT nel local storage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            // Imposta il timer per il refresh token
            setTimeout(refreshToken, (55 * 60) * 1000); // Timer di 55 minuti

            setIsLoggedIn(true);
            setRedirect(true);
        } catch (error) {
            setError(error.response.data.error); // Errore nella registrazione restituito dal server
        }
    }

    // Funzione per il refresh del token jwt
    async function refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            console.error('Token di refresh mancante');
            return;
        }

        try {
            const response = await axios.post('https://ecommerce-vscs.onrender.com/api/refresh-jwt-token', { refreshToken });

            // Aggiorna il token nel localStorage
            localStorage.setItem('token', response.data.token);

            // Reimposta il timer per il refresh
            setTimeout(refreshToken, 55 * 60 * 1000); // Timer di 55 minuti
        } catch (error) {
            console.error('Errore durante il refresh del token:', error.response.data.error); // Errore nel refresh del token restituito dal server
        }
    }

    // Funzione per mostrare la password quando si clicca la checkbox
    function showPassword() {
        const password = document.querySelector('#password');
        const confirmPassword = document.querySelector('#confirm-password');

        // Verifica se l'input della password è di tipo password
        if (password.type === 'password' && confirmPassword.type === 'password') {
            password.type = 'text'; // Cambia il tipo da password a testo
            confirmPassword.type = 'text';
        } else {
            password.type = 'password'; // Cambia il tipo da testo a password
            confirmPassword.type = 'password';
        }
    }

    if (redirect) {
        return <Navigate to="/" />;
    }

    if (!isMobileView) {
        return (
            <>
                <Navbar />
                <div className='register-container'>
                    <div className='form-container'>
                        <form className="form" onSubmit={handleSubmit}>
                            <div className="register-row">
                                <h2>Crea il tuo account</h2>
                            </div>
                            <div className="socials-row">
                                <Link to="">
                                    <img src={google} alt="Google" />
                                    Registrati con Google
                                </Link>
                                <Link to="">
                                    <img src={apple} alt="Apple" />
                                    Registrati con Apple
                                </Link>
                            </div>
                            <div className="divider">
                                <span className="divider-line"></span>
                                Oppure
                                <span className="divider-line"></span>
                            </div>
                            <div className="text-field">
                                <label htmlFor="firstName">
                                    Nome:
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        autoComplete="off"
                                        placeholder="Nome"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                    </svg>
                                </label>
                            </div>
                            <div className="text-field">
                                <label htmlFor="lastName">
                                    Cognome:
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        autoComplete="off"
                                        placeholder="Cognome"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                    </svg>
                                </label>
                            </div>
                            <div className="text-field">
                                <label htmlFor="email">
                                    Email:
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        autoComplete="off"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-at" viewBox="0 0 16 16">
                                        <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914" />
                                    </svg>
                                </label>
                            </div>
                            <div className="text-field">
                                <label htmlFor="password">
                                    Password:
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                                    </svg>
                                </label>
                            </div>
                            <div className="text-field">
                                <label htmlFor="confirm-password">
                                    Conferma Password:
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        name="confirmPassword"
                                        placeholder="Conferma Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                                    </svg>
                                </label>
                            </div>
                            <div className="show-password">
                                <label htmlFor="show-password-btn">
                                    Mostra Password
                                    <input type="checkbox" id="show-password-btn" onClick={showPassword} />
                                </label>
                            </div>
                            <button className="form-btn" type="submit">Registrati</button>
                            <div className="form-link">
                                <p>Hai già un account? <Link to="/login">Accedi</Link></p>
                            </div>
                            {error && <p className="error">{error}</p>}
                        </form>
                    </div>
                </div>
                <Footer />
            </>
        );
    } else {
        return (
            <>
                <Navbar />
                <div className='register-container'>
                    <div className='form-container'>
                        <form className="form" onSubmit={handleSubmit}>
                            <div className="register-row">
                                <h2>Crea il tuo account</h2>
                            </div>
                            <div className="socials-row">
                                <Link to="">
                                    <img src={google} alt="Google" />
                                    Registrati con Google
                                </Link>
                                <Link to="">
                                    <img src={apple} alt="Apple" />
                                    Registrati con Apple
                                </Link>
                            </div>
                            <div className="divider">
                                <span className="divider-line"></span>
                                Oppure
                                <span className="divider-line"></span>
                            </div>
                            <div className="text-field">
                                <label htmlFor="firstName">
                                    Nome:
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        autoComplete="off"
                                        placeholder="Nome"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                    </svg>
                                </label>
                            </div>
                            <div className="text-field">
                                <label htmlFor="lastName">
                                    Cognome:
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        autoComplete="off"
                                        placeholder="Cognome"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                    </svg>
                                </label>
                            </div>
                            <div className="text-field">
                                <label htmlFor="email">
                                    Email:
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        autoComplete="off"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-at" viewBox="0 0 16 16">
                                        <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914" />
                                    </svg>
                                </label>
                            </div>
                            <div className="text-field">
                                <label htmlFor="password">
                                    Password:
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                                    </svg>
                                </label>
                            </div>
                            <div className="text-field">
                                <label htmlFor="confirm-password">
                                    Confirm Password:
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                                    </svg>
                                </label>
                            </div>
                            <div className="show-password">
                                <label htmlFor="show-password-btn">
                                    Mostra Password
                                    <input type="checkbox" id="show-password-btn" onClick={showPassword} />
                                </label>
                            </div>
                            <button className="form-btn" type="submit">Registrati</button>
                            <div className="form-link">
                                <p>Hai già un account? <Link to="/login">Accedi</Link></p>
                            </div>
                            {error && <p className="error">{error}</p>}
                        </form>
                    </div>
                </div>
            </>
        );
    }
}

export default Register;
