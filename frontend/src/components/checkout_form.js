import React, { useState, useEffect } from "react";
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from "axios";
import "./css/checkout_form.css";

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isFormLoading, setIsFormLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Prende il token JWT dal local storage

        async function getUserData() {
            try {
                const response = await axios.get('/api/user/', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Imposta il token JWT come header della richiesta
                    }
                });
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setEmail(response.data.email);
            } catch (error) {
                console.error("Failed to fetch user data: ", error); // Errore nella fetch dei dati
            }
        }
        getUserData();

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
            } catch (error) {
                console.error('Error while calculating total price:', error); // Errore nella restituizione del prezzo totale
            }
        }
        getTotalPrice();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'http://127.0.0.1:8000/payment-status',
            },
            paymentMethod: {
                card: elements.getElement(PaymentElement),
                billingDetails: {
                    email: email,
                    name: `${firstName} ${lastName}`,
                },
            },
            amount: totalPrice * 100,
        });

        if (error) {
            setErrorMessage(error.message);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const stripeElement = document.querySelector('.__PrivateStripeElement');
            if (stripeElement) {
                stripeElement.style.padding = '20px';
                stripeElement.style.overflow = 'hidden';
                clearInterval(interval);
            }
            setIsFormLoading(false);
        }, 100);
    }, []);

    return (
        <form className="payment-form" onSubmit={handleSubmit}>
            {isFormLoading ? (
                <div className="form-spinner"></div>
            ) : (
                <>
                    <PaymentElement id="payment-element" options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                                padding: '0',
                            },
                            invalid: {
                                color: '#df1b41',
                            },
                        }
                    }} />
                    <button disabled={isLoading || !stripe || !elements} id="pay-btn">
                        {isLoading ? <div className="spinner"></div> : "Paga Ora"}
                        {isLoading ? (
                            <></>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-credit-card-fill" viewBox="0 0 16 16">
                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1" />
                            </svg>
                        )}
                    </button>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </>
            )}
        </form>
    );
}

export default CheckoutForm;
