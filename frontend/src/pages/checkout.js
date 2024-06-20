import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import SearchBar from "../components/search_bar.js";
import Footer from "../components/footer.js";
import "../components/css/checkout.css";

function Checkout() {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);
    const [totalPrice, setTotalPrice] = useState(0);
    const [formData, setFormData] = useState({
        address: '',
        postalCode: '',
        city: '',
        state: '',
        province: '',
    });
    const [formModified, setFormModified] = useState(false);

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

    useEffect(() => {
        const token = localStorage.getItem('token'); // Prende il token JWT dal local storage

        // Funzione per ottenere l'id dell'utente dal database
        async function getUserId() {
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
                    address: response.data.address,
                    postalCode: response.data.postalCode,
                    city: response.data.city,
                    state: response.data.state,
                    province: response.data.province
                }));
            } catch (error) {
                console.error('Failed to fetch user data:', error); // Errore nella fetch dei dati
            }
        }
        getUserData();

        // Funzione per ottenere il prezzo totale
        async function getTotalPrice() {
            const token = localStorage.getItem('token'); // Ottieni il token JWT dal local storage
            const userId = await getUserId(token);  // ID dell'utente ottenuto dalla funzione getUserId()

            const headers = {
                'Authorization': `Bearer ${token}` // Imposta il token JWT come header della richiesta
            };

            // Oggetto che contiene il parametro user_id per cercare nel database il carrello corretto
            const params = {
                user_id: userId,
            }

            try {
                const response = await axios.get('/api/cart/get-total-price/', { // Risposta del server Django
                    params,
                    headers
                });
                setTotalPrice(response.data.total);
                return response.data.total;
            } catch (error) {
                console.error('Error while calculating total price:', error); // Errore nella restituizione del prezzo totale
            }
        }
        getTotalPrice();
    }, []);

    // Funzione che permette di modificare gli input
    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormModified(true);
    }

    // Funzione per il submit dei dati del form
    async function handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Ottieni il token JWT dal local storage

        const headers = {
            'Authorization': `Bearer ${token}` // Imposta il token JWT come header della richiesta
        }

        try {
            const response = await axios.post('/api/update-user-data/', formData, { headers });
            setFormData(prevFormData => ({
                ...prevFormData,
                address: response.data.address,
                postalCode: response.data.postalCode,
                city: response.data.city,
                state: response.data.state,
                province: response.data.province
            }));
            redirectToPayment();
        } catch (error) {
            console.error("Failed to fetch user data: ", error);
        }
    }

    // Funzione per ottenere l'id dell'utente dal database
    async function getUserIdForRedirect() {
        const token = localStorage.getItem('token'); // Ottieni il token JWT dal local storage
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

    // Funzione per reindirizzare l'utente alla pagina di pagamento
    async function redirectToPayment() {
        const token = localStorage.getItem('token'); // Ottieni il token JWT dal local storage
        const userId = await getUserIdForRedirect(token);
        navigate(`/payment/${userId}`);
    }

    if (!isMobileView) {
        return (
            <>
                <Navbar />
                <div className="checkout-container">
                    <form className="checkout-form">
                        <h2>Indirizzo di consegna</h2>
                        <div className="checkout-input address-input">
                            <label htmlFor="address">
                                Indirizzo:
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    autoComplete="off"
                                    placeholder="Indirizzo"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                        <div className="checkout-input city-pc-province">
                            <label htmlFor="address" className="city-label">
                                Città:
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    autoComplete="off"
                                    placeholder="Città"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label htmlFor="postal-code" className="postal-code-label">
                                CAP:
                                <input
                                    type="text"
                                    id="postal-code"
                                    name="postal-code"
                                    autoComplete="off"
                                    placeholder="CAP"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label htmlFor="province" className="province-lable">
                                Provincia:
                                <input
                                    type="text"
                                    id="province"
                                    name="province"
                                    autoComplete="off"
                                    placeholder="Provincia"
                                    value={formData.province}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                    </form>
                    <div className="checkout-total">
                        <h2>Riepilogo Ordine</h2>
                        <p className="total-products">Numero prodotti <span>0</span></p>
                        <p>Totale prodotti <span>€ {totalPrice.toFixed(2)}</span></p>
                        <p className="shipping-cost">Costi spedizione <span>€ 0.00</span></p>
                        <p className="checkout-total-price">Totale <span>€ {totalPrice.toFixed(2)}</span></p>
                        <button className="confirm-purchase-btn" onClick={handleSubmit}>
                            Conferma Ordine
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    } else {
        return (
            <>
                <Navbar />
                <SearchBar />
                <div className="checkout-container">
                    <form className="checkout-form">
                        <h2>Indirizzo di consegna</h2>
                        <div className="checkout-input address-input">
                            <label htmlFor="address">
                                Indirizzo:
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    autoComplete="off"
                                    placeholder="Indirizzo"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                        <div className="checkout-input city-pc-province">
                            <label htmlFor="address" className="city-label">
                                Città:
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    autoComplete="off"
                                    placeholder="Città"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label htmlFor="postal-code" className="postal-code-label">
                                CAP:
                                <input
                                    type="text"
                                    id="postal-code"
                                    name="postal-code"
                                    autoComplete="off"
                                    placeholder="CAP"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label htmlFor="province" className="province-lable">
                                Provincia:
                                <input
                                    type="text"
                                    id="province"
                                    name="province"
                                    autoComplete="off"
                                    placeholder="Provincia"
                                    value={formData.province}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                    </form>
                    <div className="checkout-total">
                        <h2>Riepilogo Ordine</h2>
                        <p className="total-products">Numero prodotti <span>0</span></p>
                        <p>Totale prodotti <span>€ {totalPrice.toFixed(2)}</span></p>
                        <p className="shipping-cost">Costi spedizione <span>€ 0.00</span></p>
                        <p className="checkout-total-price">Totale <span>€ {totalPrice.toFixed(2)}</span></p>
                        <button className="confirm-purchase-btn" onClick={handleSubmit}>
                            Conferma Ordine
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

export default Checkout;
