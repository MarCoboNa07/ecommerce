import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './css/card.css';

function Card({ product }) {
    const navigate = useNavigate();

    // Funzione che modifica il prezzo in modo che abbia sempre 2 cifre dopo la virgola
    const formattedPrice = (price) => {
        const numericPrice = Number(price); // Conversione da stringa a numero
        return numericPrice.toFixed(2); // Mostra 2 cifre dopo la virgola
    }

    // Funzione per reindirizzare l'utente alla pagina del prodotto
    function handleClick() {
        navigate(`/product/${product.name}/${product.item_id}`, { state: { item_id: product.item_id, name: product.name, img1: product.img1, img2: product.img2, img3: product.img3, img4: product.img4, img5: product.img5, price: product.price, brand: product.brand, description: product.description, information: product.information } }); // Reindirizza alla pagina del prodotto e passa i dati del prodotto inviati dal server Django come stato
    }

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

    // Funzione per aggiungere un prodotto al carrello
    async function addToCart(e) {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('token'); // Ottieni il token JWT dal local storage
            const userId = await getUserId(token); // ID dell'utente ottenuto dalla funzione getUserId()

            const headers = {
                'Authorization': `Bearer ${token}` // Imposta il token JWT come header della richiesta
            };

            // Oggetto che contiene i dati del prodott aggiunto al carrello
            const productData = {
                product_id: product.item_id,
                name: product.name,
                img: product.img1,
                price: product.price,
                productQuantity: "1",
            };

            // Oggetto che condiene i parametri per la richiesta al server Django
            const requestData = {
                user_id: userId,
                items: productData,
            }

            const response = await axios.post('/api/cart/add-to-cart/', requestData, { headers }); // RIsposta del server Django
            navigate('/cart?addToCart=true'); // Reindirizza l'utente al carrello
        } catch (error) {
            console.error('Errore while adding to cart:', error); // Errore nell'aggiunta del prodotto al carrello
        }
    };

    return (
        <div className="card" onClick={handleClick}>
            <img src={product.img1} alt={product.name} />
            <h2 className="product-name">{product.name}</h2>
            <p className="price">€ {formattedPrice(product.price)}</p>
            <p className="reviews">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill star" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill star" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill star" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill star" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill star" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
                (1000+ recensioni)
            </p>
            <button className="add-to-cart-btn" onClick={addToCart}>
                Aggiungi al Carrello
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart2" viewBox="0 0 16 16">
                    <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                </svg>
            </button>
        </div>
    );
}

export default Card;
