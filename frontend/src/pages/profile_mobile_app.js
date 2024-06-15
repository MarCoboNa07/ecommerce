import React, { useState, useEffect } from "react";
import { NavLink, Link, Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import GooglePlayBadge from "../components/img/google_play_badge.png";
import AppStoreBadge from "../components/img/app_store_badge.svg";
import "../components/css/profile.css";

function ProfileMobileApp() {
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
                        <div className="profile-mobile-app">
                            <h2>Scarica la nostra App</h2>
                            <div className="download-app-container">
                                <h2 className="download-app-banner-title">Veloce. Comoda. Sicura.</h2>
                                <h2 className="download-app-banner-title">Facile da usare.</h2>
                                <div className="store-badges">
                                    <Link to="https://play.google.com/store/search?q=brawl+stars&c=apps&hl=it" target="_blank">
                                        <img src={GooglePlayBadge} id="google-play-badge" />
                                    </Link>
                                    <Link to="https://apps.apple.com/it/app/brawl-stars/id1229016807" target="_blank">
                                        <img src={AppStoreBadge} id="app-store-badge" />
                                    </Link>
                                </div>
                            </div>
                        </div>
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
                        <div className="profile-mobile-app">
                            <h2>Scarica la nostra App</h2>
                            <div className="download-app-container">
                                <h2 className="download-app-banner-title">Veloce. Comoda. Sicura.</h2>
                                <h2 className="download-app-banner-title">Facile da usare.</h2>
                                <div className="store-badges">
                                    <Link to="https://play.google.com/store/search?q=brawl+stars&c=apps&hl=it" target="_blank">
                                        <img src={GooglePlayBadge} id="google-play-badge" />
                                    </Link>
                                    <Link to="https://apps.apple.com/it/app/brawl-stars/id1229016807" target="_blank">
                                        <img src={AppStoreBadge} id="app-store-badge" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default ProfileMobileApp;
