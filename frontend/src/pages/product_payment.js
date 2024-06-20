import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import CheckoutForm from "../components/checkout_form";
import "../components/css/product_payment.css";

const stripePromise = loadStripe('pk_test_51P8oOzRtfkaY6Tw2Zk6ZcKeutlzpApH9WwaCW4coqzFwBf8iXlECLNbk6XQsBmA5z93QuZPErfuHWXDEUYgyzCXp00pEWJEBEp');

function ProductPayment() {
    const [clientSecret, setClientSecret] = useState('');

    const location = useLocation();
    const { item_id, name, price, img } = location.state;

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

        if (price) {
            async function fetchClientSecret() {
                await fetch('/api/payment-intent/', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    body: JSON.stringify({
                        items: [{ id: 'Uv81cde3499ddc2afd03f59576838e' }],
                        amount: price * 100,
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
        <div className="product-payment-container">
            <div className="product-payment-img">
                <img src={img} alt={name} />
            </div>
            <div className="product-payment-form">
                {clientSecret && (
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutForm />
                    </Elements>
                )}
            </div>
        </div>
    );
}

export default ProductPayment;
