import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../components/css/product_checkout.css";

function ProductCheckout() {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);
    const [formData, setFormData] = useState({
        address: '',
        postalCode: '',
        city: '',
        state: '',
        province: '',
    });

    const location = useLocation();
    const { item_id, name, price, img } = location.state;
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
    }, []);

    // Funzione che permette di modificare gli input
    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    // FUnzione per il submit dei dati del form
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
        navigate(`/product-payment/${userId}`, { state: { item_id: item_id, name: name, price: price, img: img } });
    }

    if (!isMobileView) {
        return (
            <>
                <Navbar />
                <div className="product-checkout-container">
                    <div className="product-checkout-img">
                        <img src={img} alt={name} />
                    </div>
                    <div className="product-checkout-form-container">
                        <form className="product-checkout-form">
                            <h2>Indirizzo di consegna</h2>
                            <div className="checkout-input product-address-input">
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
                            <div className="checkout-input product-city-pc-province">
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
                            <button className="product-confirm-purchas-btn" onClick={handleSubmit}>
                                Conferma Ordine
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                                </svg>
                            </button>
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
                <div className="product-checkout-container">
                    <div className="product-checkout-form-container">
                        <form className="product-checkout-form">
                            <h2>Indirizzo di consegna</h2>
                            <div className="checkout-input product-address-input">
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
                            <div className="checkout-input product-city-pc-province">
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
                            <button className="product-confirm-purchas-btn" onClick={handleSubmit}>
                                Conferma Ordine
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}

export default ProductCheckout;
