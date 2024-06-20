import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/cart_card.css";

function CartCard({ product, quantity, onRemoveFromCart, getTotalPrice }) {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);

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

    // Funzione per rimuovere un prodotto dal carrello
    async function removeFromCart() {
        try {
            const token = localStorage.getItem('token'); // Ottieni il token JWT dal local storage
            const userId = await getUserId(token); // ID dell'utente ottenuto dalla funzione getUserId()

            const headers = {
                'Authorization': `Bearer ${token}` // Imposta il token JWT come header della richiesta
            };

            // Oggetto che condiene i parametri per la richiesta al server Django
            const requestData = {
                user_id: userId,
                product_id: product.product_id,
            }

            const response = await axios.post('/api/cart/remove-from-cart/', requestData, { headers }); // RIsposta del server Django
            onRemoveFromCart(product.product_id);
        } catch (error) {
            console.error("Error while removing product from the cart: ", error); // Errore nella rimozione del prodotto dal carrello
        }
    }

    if (!isMobileView) {
        return (
            <div className="cart-card">
                <img src={product.img} alt={product.name} />
                <p>{product.name}</p>
                <p>€ {product.price}</p>
                <p>{quantity}</p>
                <button className="remove-from-cart-btn" onClick={removeFromCart}>
                    Rimuovi
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                </button>
            </div>
        );
    } else {
        return (
            <div className="mobile-cart-card">
                <div className="top-mobile-cart-card">
                    <img src={product.img} alt={product.name} />
                </div>
                <div className="bottom-mobile-cart-card">
                    <p>{product.name}</p>
                    <p>€ {product.price}</p>
                    <p>Quantità: {quantity}</p>
                    <button className="remove-from-cart-btn" onClick={removeFromCart}>
                        Rimuovi
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }
}

export default CartCard;
