import React, { useState, useEffect } from "react";
import { NavLink, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../components/css/profile.css";

function ProfileAccount() {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState('');
    const [formError, setFormError] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

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

    // Funzione per ottenere i dati dell'utente 
    useEffect(() => {
        const token = localStorage.getItem('token'); // Ottieni il token JWT dal local storage
        if (token) {
            setIsLoggedIn(true);

            async function getUserData() {
                try {
                    const response = await axios.get('/api/user/', {
                        headers: {
                            'Authorization': `Bearer ${token}` // Imposta il token JWT come header della richiesta
                        }
                    });
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        email: response.data.email,
                        phone: response.data.phone
                    }));
                } catch (error) {
                    console.error("Failed to fetch user data: ");
                }
            }
            getUserData();
        }
    }, []);

    // Funzione che permette di modificare gli input
    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        const token = localStorage.getItem('token'); // Ottieni il token JWT dal local storage
        e.preventDefault();

        setMessage(null);
        setFormError(null);

        try {
            const response = await axios.post('/api/update-user-data/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}` // Imposta il token JWT come header della richiesta
                }
            });
            setFormData(prevFormData => ({
                ...prevFormData,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                phone: response.data.phone
            }));
            setMessage(response.data.message);
            window.location.reload(true);
        } catch (error) {
            setMessage(error.response.data.error);
            console.error("Errore updating user data: ", error);
        }
    }

    // Funzione di logout
    async function handleLogout() {
        try {
            await axios.post('/api/logout'); // Richiesta all'API di logout
            localStorage.removeItem('token'); // Elimina il token JWT dal local storage
            setIsLoggedIn(false);
            setRedirect(true);
        } catch (error) {
            console.error("Failed logout: ", error); // Errore durante il logout
        }
    }

    if (redirect) {
        return <Navigate to="/login" />;
    }

    if (!isMobileView) {
        return (
            <>
                <Navbar />
                <div className="profile-container">
                    <div className="left-profile-container">
                        <div className="profile-name">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                            </svg>
                            <p>{formData.firstName} {formData.lastName}</p>
                        </div>
                        <div className="profile-side-bar">
                            <ul>
                                <NavLink to="/profile/account"><li>Account</li></NavLink>
                                <NavLink to="/profile/password"><li>Password</li></NavLink>
                                <NavLink to="/profile/notifications"><li>Notifiche</li></NavLink>
                                <NavLink to="/profile/mobile-app"><li>App mobile</li></NavLink>
                                <NavLink onClick={handleLogout}>
                                    <li className="profile-last-link logout-link">
                                        Logout
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                                            <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
                                        </svg>
                                    </li>
                                </NavLink>
                            </ul>
                        </div>
                    </div>
                    <div className="right-profile-container">
                        <form className="profile-account-form" onSubmit={handleSubmit}>
                            <h2>Informazioni personali</h2>
                            <div className="profile-text-field">
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
                                </label>
                            </div>
                            <div className="profile-text-field">
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
                                </label>
                            </div>
                            <div className="profile-text-field">
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
                                </label>
                            </div>
                            <div className="profile-text-field">
                                <label htmlFor="password">
                                    Telefono:
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        placeholder="Telefono"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                            <button className="update-data-btn">Aggiorna Informazioni</button>
                            {message && (<p className="profile-form-message">{message}</p>)}
                            {formError && (<p className="profile-form-error">{formError}</p>)}
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
                <div className="profile-container">
                    <div className="left-profile-container">
                        <div className="profile-name">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                            </svg>
                            <p>{formData.firstName} {formData.lastName}</p>
                        </div>
                        <div className="profile-side-bar">
                            <ul>
                                <NavLink to="/profile/account"><li>Account</li></NavLink>
                                <NavLink to="/profile/password"><li>Password</li></NavLink>
                                <NavLink to="/profile/notifications"><li>Notifiche</li></NavLink>
                                <NavLink to="/profile/mobile-app"><li>App mobile</li></NavLink>
                                <NavLink onClick={handleLogout}>
                                    <li className="profile-last-link logout-link">
                                        Logout
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                                            <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
                                        </svg>
                                    </li>
                                </NavLink>
                            </ul>
                        </div>
                    </div>
                    <div className="right-profile-container">
                        <form className="profile-account-form" onSubmit={handleSubmit}>
                            <h2>Informazioni personali</h2>
                            <div className="profile-text-field">
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
                                </label>
                            </div>
                            <div className="profile-text-field">
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
                                </label>
                            </div>
                            <div className="profile-text-field">
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
                                </label>
                            </div>
                            <div className="profile-text-field">
                                <label htmlFor="password">
                                    Telefono:
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        placeholder="Telefono"
                                        value=''
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                            </div>
                            <button className="update-data-btn">Aggiorna Informazioni</button>
                            {message && (<p className="profile-form-message">{message}</p>)}
                            {formError && (<p className="profile-form-error">{formError}</p>)}
                        </form>
                    </div>
                </div>
            </>
        );
    }
}

export default ProfileAccount;
