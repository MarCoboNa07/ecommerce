import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import CheckoutForm from "../components/checkout_form";
import "../components/css/payment.css";

const stripePromise = loadStripe('pk_test_51P8oOzRtfkaY6Tw2Zk6ZcKeutlzpApH9WwaCW4coqzFwBf8iXlECLNbk6XQsBmA5z93QuZPErfuHWXDEUYgyzCXp00pEWJEBEp');

function Payment() {
    const [clientSecret, setClientSecret] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);

    const productPrice = parseFloat(new URLSearchParams(window.location.search).get('product_price'));

    useEffect(() => {
        const token = localStorage.getItem('token'); // Prende il token JWT dal local storage

        async function getUserEmail() {
            try {
                const response = await axios.get('/api/user/', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Imposta il token JWT come header della richiesta
                    }
                });
                return response.data.email;
            } catch (error) {
                console.error("Failed to fetch user data: ", error); // Errore nella fetch dei dati
            }
        }

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
                return response.data.total;
            } catch (error) {
                console.error('Error while calculating total price:', error); // Errore nella restituizione del prezzo totale
            }
        }
        getTotalPrice();

        if (productPrice) {
            async function fetchClientSecret() {
                await fetch('/api/payment-intent/', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    body: JSON.stringify({
                        items: [{ id: 'Uv81cde3499ddc2afd03f59576838e' }],
                        amount: productPrice * 100,
                        email: await getUserEmail(),
                    })
                })
                    .then((res) => res.json())
                    .then((data) => setClientSecret(data.clientSecret))
            }
            fetchClientSecret();
        } else {
            async function fetchClientSecret() {
                await fetch('/api/payment-intent/', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    body: JSON.stringify({
                        items: [{ id: 'Uv81cde3499ddc2afd03f59576838e' }],
                        amount: await getTotalPrice() * 100,
                        email: await getUserEmail(),
                    })
                })
                    .then((res) => res.json())
                    .then((data) => setClientSecret(data.clientSecret))
            }
            fetchClientSecret();
        }
    }, []);

    function getCookie(name) {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    }

    const appearance = {
        theme: 'stripe',
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="payment-container">
            <div className="payment-left">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                </svg>
                <h2>Pagamento Carrello</h2>
            </div>
            <div className="payment-right">
                {clientSecret && (
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm />
                    </Elements>
                )}
            </div>
        </div>
    );
}

export default Payment;
