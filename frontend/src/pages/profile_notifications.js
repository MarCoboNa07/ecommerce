import React, { useState, useEffect } from "react";
import { NavLink, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../components/css/profile.css";

function ProfileNotifications() {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [redirect, setRedirect] = useState(false);

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
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                } catch (error) {
                    console.error("Failed to fetch user data: ");
                }
            }
            getUserData();
        }
    }, []);

    // Funzione di logout
    async function handleLogout() {
        try {
            await axios.post('/api/logout/'); // Richiesta all'API di logout
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
                            <p>{firstName} {lastName}</p>
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
                        <form className="profile-notifications-form">
                            <h2>Impostazioni delle Notifiche</h2>
                            <label>
                                <input type="checkbox" />
                                Desidero ricevere notifiche via email sulle migliori offerte
                            </label>
                            <label>
                                <input type="checkbox" />
                                Desidero ricevere notifiche via email sui nuovi prodotti
                            </label>
                            <label>
                                <input type="checkbox" />
                                Desidero ricevere notifiche via email sui prodotti più venduti
                            </label>
                            <button className="update-data-btn">Aggiorna</button>
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
                            <p>{firstName} {lastName}</p>
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
                        <form className="profile-notifications-form">
                            <h2>Impostazioni delle Notifiche</h2>
                            <label>
                                <input type="checkbox" />
                                Desidero ricevere notifiche via email sulle migliori offerte
                            </label>
                            <label>
                                <input type="checkbox" />
                                Desidero ricevere notifiche via email sui nuovi prodotti
                            </label>
                            <label>
                                <input type="checkbox" />
                                Desidero ricevere notifiche via email sui prodotti più venduti
                            </label>
                            <button className="update-data-btn">Aggiorna</button>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}

export default ProfileNotifications;
