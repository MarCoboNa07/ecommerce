import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import SearchBar from "../components/search_bar";
import CartCard from "../components/cart_card";
import Footer from "../components/footer";
import "../components/css/cart.css";

function Cart() {
    const [isLoggedIn, setIseLoggedIn] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);

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
        const token = localStorage.getItem('token'); // Ottieni il token JWT dal local storage
        const searchParam = new URLSearchParams(window.location.search); // Ottieni una parte dell'url
        const addToCart = searchParam.get('addToCart'); // cerca 'addToCart' nell'url

        // Verifica se l'utente è autenticato con l'esistenza del token JWT
        if (token) {
            setIseLoggedIn(true);
        } else {
            setIseLoggedIn(false);
        }

        // Se il parametro 'addToCart' nell'url è uguale a true aggiungi il prodotto al carrello
        if (addToCart == "true") {
            setIsAddedToCart(true);
            setTimeout(() => {
                setIsAddedToCart(false);
            }, 1000);
        }

        // Se l'utente ha effettuato il login mostra il carrello
        if (isLoggedIn) {
            getCart();
        }
    }, [isLoggedIn]);

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

    // Funzione per ottenere il contenuto del carrello
    async function getCart() {
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
            const response = await axios.get('/api/cart/get-cart/', { // Risposta del server Django
                params,
                headers
            });
            setCartItems(response.data.items);
            getTotalPrice();
        } catch (error) {
            console.error('Error to fetch cart:', error); // Errore nella fetch del carrello
        }
    }

    // Funzione per rimuovere la card dal carrello in tempo reale
    const onRemoveFromCart = (productId) => {
        const updatedCartItems = cartItems.filter(item => item.product_id !== productId); // Filtra l'array cartItems cercando il prodotto eliminato tramite il product_id
        setCartItems(updatedCartItems); // Aggiorna l'array cartItems
        getTotalPrice();
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

    // Funzione per reindirizzare l'utente alla pagina di checkout
    async function redirectToCheckout() {
        const token = localStorage.getItem('token'); // Ottieni il token JWT dal local storage
        const userId = await getUserId(token);
        navigate(`/checkout/${userId}`);
    }

    if (isAddedToCart) {
        return (
            <div className="added-to-cart">
                <h2>Prodotto aggiunto al Carrello</h2>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                </svg>
            </div>
        );
    }

    if (isLoggedIn) {
        if (cartItems.length > 0) {
            if (!isMobileView) {
                return (
                    <>
                        <Navbar />
                        <div className="cart-container">
                            <div className="cart-headers">
                                <p>Prodotto</p>
                                <p>Nome</p>
                                <p>Prezzo</p>
                                <p>Quantità</p>
                                <p>Rimuovi</p>
                            </div>
                            <div className="cart-product">
                                {cartItems.map((product, index) => (
                                    <CartCard
                                        key={index}
                                        product={product}
                                        quantity={product.productQuantity}
                                        onRemoveFromCart={onRemoveFromCart}
                                        getTotalPrice={getTotalPrice}
                                    />
                                ))}
                            </div>
                            <div className="cart-total">
                                <h2>Totale Carrello</h2>
                                <p>Totale prodotti <span>€ {totalPrice.toFixed(2)}</span></p>
                                <p className="shipping-cost">Costi spedizione <span>€ 0.00</span></p>
                                <p className="cart-total-price">Totale <span>€ {totalPrice.toFixed(2)}</span></p>
                                <button className="confirm-purchase-btn" onClick={redirectToCheckout}>
                                    Conferma Acquisti
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
                        <div className="cart-container">
                            <div className="cart-product">
                                {cartItems.map((product, index) => (
                                    <CartCard
                                        key={index}
                                        product={product}
                                        quantity={product.productQuantity}
                                        onRemoveFromCart={onRemoveFromCart}
                                        getTotalPrice={getTotalPrice}
                                    />
                                ))}
                            </div>
                            <div className="cart-total">
                                <h2>Totale Carrello</h2>
                                <p>Totale prodotti <span>€ {totalPrice.toFixed(2)}</span></p>
                                <p className="shipping-cost">Costi spedizione <span>€ 0.00</span></p>
                                <p className="cart-total-price">Totale <span>€ {totalPrice.toFixed(2)}</span></p>
                                <button className="confirm-purchase-btn" onClick={redirectToCheckout}>
                                    Conferma Acquisti
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
        } else {
            if (!isMobileView) {
                return (
                    <>
                        <Navbar />
                        <div className="empty-cart-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                            </svg>
                            <h2>Il tuo Carrello è vuoto</h2>
                            <p>Il tuo carrello aspetta solo di essere riempito.</p>
                            <p>Visita la sezione <Link>Esplora</Link> e la sezione <Link>Offerte</Link>.</p>
                        </div>
                        <Footer />
                    </>
                );
            } else {
                return (
                    <>
                        <Navbar />
                        <SearchBar />
                        <div className="empty-cart-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                            </svg>
                            <h2>Il tuo Carrello è vuoto</h2>
                            <p>Il tuo carrello aspetta solo di essere riempito.</p>
                            <p>Visita la sezione <Link>Esplora</Link> e la sezione <Link>Offerte</Link>.</p>
                        </div>
                    </>
                );
            }
        }
    } else {
        if (!isMobileView) {
            return (
                <>
                    <Navbar />
                    <div className="not-logged-cart-container">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-x" viewBox="0 0 16 16">
                            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708" />
                        </svg>
                        <p><Link to="/login">Accedi</Link> al tuo account per vedere il contenuto del carrello o aggiungerci prodotti.</p>
                        <p>Se non hai un account puoi registrati gratuitamente <Link to="/register">qui</Link>.</p>
                    </div>
                    <Footer />
                </>
            );
        } else {
            return (
                <>
                    <Navbar />
                    <SearchBar />
                    <div className="not-logged-cart-container">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-x" viewBox="0 0 16 16">
                            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708" />
                        </svg>
                        <p><Link to="/login">Accedi</Link> al tuo account per vedere il contenuto del carrello o aggiungerci prodotti.</p>
                        <p>Se non hai un account puoi registrati gratuitamente <Link to="/register">qui</Link>.</p>
                    </div>
                </>
            );
        }
    }
}

export default Cart;
