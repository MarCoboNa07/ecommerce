import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import logo from './img/logo_gray.svg';
import SearchBar from "./search_bar";
import './css/navbar.css';

function Navbar() {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [firstName, setFirstName] = useState('');

    const navigate = useNavigate();

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

    // Recupero dei dati dell'utente
    useEffect(() => {
        const token = localStorage.getItem('token'); // Prende il token JWT dal local storage
        if (token) {
            setIsLoggedIn(true); // Utente autenticato

            // Richiesta all'API user per prendere i dati dell'utente 
            axios.get('/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                setFirstName(response.data.firstName); // Imposta il nome dell'utente sullo stato
            })
            .catch(error => {
                console.error("Failed to fetch user data: ", error); // Errore nella fetch dei dati
            })
        } else {
            setIsLoggedIn(false); // Utente non autenticato
        }
    }, []);

    // Funzione per ottenere l'id dell'utente dal database
    async function getUserId(token) {
        try {
            const response = await axios.get('/api/user/', { // Risposta del server Django
                headers: {
                    'Authorization': `Bearer ${token}` // Imposta il token JWT come header della richiesta
                }
            });
            return response.data.user_id; // Restituisci l'id dell'utente come risultato della funzione
        } catch (error) {
            console.error('Failed to fetch user data:', error); // Errore nella fetch dei dati
        }
    }

    // Funzione per reindirizzare l'utente al profilo
    async function handleProfileClick() {
        const token = localStorage.getItem('token'); // Ottieni il token JWT dal local storage
        const userId = await getUserId(token);
        navigate(`/profile/account`);
    }

    if (!isMobileView) {
        return (
            <nav className="navbar">
                <div className="nav-logo">
                    <NavLink>
                        <img src={logo} />
                        <h2>E-Commerce</h2>
                    </NavLink>
                </div>
                <div className="menu">
                    <ul>
                        <li>
                            <NavLink to="/">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/explore">Esplora</NavLink>
                        </li>
                        <li>
                            <NavLink to="/offers">Offerte</NavLink>
                        </li>
                        <li>
                            <NavLink to="/contact">Contattaci</NavLink>
                        </li>
                    </ul>
                </div>
                <SearchBar />
                <div className="nav-user-section">
                    <div className="nav-cart-btn">
                        <NavLink to="/cart">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                            </svg>
                        </NavLink>
                    </div>
                    {isLoggedIn ? (
                        <div className="nav-profile">
                            <NavLink onClick={handleProfileClick}>
                                <p>Ciao, {firstName}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                </svg>
                            </NavLink>
                        </div>
                    ) : (
                        <div className="login-section">
                            <NavLink to="/login" className="login-link">Accedi</NavLink>
                            <NavLink to="/register" className="register-link">Registrati</NavLink>
                        </div>
                    )}
                </div>
            </nav>
        );
    } else {
        return (
            <>
                <nav className="top-nav">
                    <div className="nav-logo">
                        <NavLink>
                            <img src={logo} />
                            <h2>E-Commerce</h2>
                        </NavLink>
                    </div>
                    {isLoggedIn ? (
                        <div className="nav-profile">
                            <NavLink onClick={handleProfileClick}>
                                <p>Ciao, {firstName}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                </svg>
                            </NavLink>
                        </div>
                    ) : (
                        <div className="nav-user-section">
                            <div className="login-section">
                                <NavLink to="/login" className="login-link">Accedi</NavLink>
                                <NavLink to="/register" className="register-link">Registrati</NavLink>
                            </div>
                        </div>
                    )}
                </nav>
                <nav className="bottom-nav">
                    <div className="mobile-menu">
                        <ul>
                            <li>
                                <NavLink to="/">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-house" viewBox="0 0 16 16">
                                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                                    </svg>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/explore">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-compass" viewBox="0 0 16 16">
                                        <path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016m6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0" />
                                        <path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z" />
                                    </svg>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/offers">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-clipboard-data" viewBox="0 0 16 16">
                                        <path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0z" />
                                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z" />
                                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z" />
                                    </svg>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/cart">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
                                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                    </svg>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink className="/profile">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                    </svg>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </>
        );
    }
}

export default Navbar;
