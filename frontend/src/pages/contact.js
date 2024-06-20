import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../components/css/contact.css";

function Contact() {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);
    const [formData, setFormData] = useState({
        fisrtName: '',
        email: '',
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

    useEffect(() => {
        const token = localStorage.getItem('token'); // Prende il token JWT dal local storage

        // Funzione per ottenere i dati dell'utente dal database
        async function getUserData() {
            try {
                const response = await axios.get('/api/user/', { // Risposta del server Django
                    headers: {
                        'Authorization': `Bearer ${token}` // Imposta il token JWT come header della richiesta
                    }
                });
                setFormData(prevFormData => ({
                    ...prevFormData,
                    firstName: response.data.firstName,
                    email: response.data.email
                }));
            } catch (error) {
                console.error('Failed to fetch user data:', error); // Errore nella fetch dei dati
            }
        }
        getUserData();
    }, []);

    // Funzione che permette di modificare gli input
    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    if (!isMobileView) {
        return (
            <>
                <Navbar />
                <div className="contact-container">
                    <div className="contact-title">
                        <h2>Contattaci</h2>
                        <p>Resta sempre in contatto con noi</p>
                    </div>
                    <div className="contact-container-content">
                        <div className="contact-info">
                            <section>
                                <p className="contact-info-label">Indirizzo</p>
                                <p className="contact-info-data">Milano 20121 Via dalle Palle</p>
                            </section>
                            <section>
                                <p className="contact-info-label">Telefono</p>
                                <p className="contact-info-data">+39 000 000 0000</p>
                            </section>
                            <section>
                                <p className="contact-info-label">Email</p>
                                <p className="contact-info-data">user.example@gmail.com</p>
                            </section>
                        </div>
                        <div className="contact-user-data">
                            <form>
                                <div className="contact-text-field name-email">
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
                                <div className="contact-text-field">
                                    <label>
                                        Messaggio:
                                        <textarea placeholder="Inserisci un messaggio"></textarea>
                                    </label>
                                </div>
                                <button type="submit" className="submit-message-btn">
                                    Invia
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                                    </svg>
                                </button>
                            </form>
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
                <div className="contact-container">
                    <div className="contact-title">
                        <h2>Contattaci</h2>
                        <p>Resta sempre in contatto con noi</p>
                    </div>
                    <div className="contact-container-content">
                        <div className="contact-info">
                            <section>
                                <p className="contact-info-label">Indirizzo</p>
                                <p className="contact-info-data">Milano 20121 Via dalle Palle</p>
                            </section>
                            <section>
                                <p className="contact-info-label">Telefono</p>
                                <p className="contact-info-data">+39 000 000 0000</p>
                            </section>
                            <section>
                                <p className="contact-info-label">Email</p>
                                <p className="contact-info-data">user.example@gmail.com</p>
                            </section>
                        </div>
                        <div className="contact-user-data">
                            <form>
                                <div className="contact-text-field name-email">
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
                                <div className="contact-text-field">
                                    <label>
                                        Messaggio:
                                        <textarea placeholder="Inserisci un messaggio"></textarea>
                                    </label>
                                </div>
                                <button type="submit" className="submit-message-btn">
                                    Invia
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Contact;
