import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "../components/css/product.css";

function Product() {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);
    const [mainImg, setMainImg] = useState("");
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);
    const [activeAccordions, setActiveAccordions] = useState([]);
    let touchStartX = 0;
    let touchEndX = 0;

    const location = useLocation();
    const { item_id, name, img1, img2, img3, img4, img5, price, brand, description, information } = location.state;

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

    // Funzione che cliccando su una box delle immagini secondarie mostra l'immagine come principale
    const handleBoxClick = (imgSrc, index) => {
        setMainImg(imgSrc);
        setSelectedImgIndex(index);
    };

    // Funzione per lo swipe da destra verso sinistra dell'immagine
    const handleSwipeLeft = () => {
        if (selectedImgIndex < 4) { // Verifica che non siamo all'ultima immagine
            setMainImg(eval(`img${selectedImgIndex + 2}`)); // Cambia mainImg con l'immagine successiva
            setSelectedImgIndex(selectedImgIndex + 1); // Cambia l'indice dell'immagine con quello successivo
        } else {
            setMainImg(img1); // Se siamo all'ultima immagine passa alla prima
            setSelectedImgIndex(0); // Imposta l'indice della prima immagine
        }
    };

    // Funzione per lo swipe da sinistra verso destra dell'immagine
    const handleSwipeRight = () => {
        if (selectedImgIndex > 0) { // Verifica che non siamo alla prima immagine
            setMainImg(eval(`img${selectedImgIndex}`)); // Cambia mainImg con l'immagine precedente
            setSelectedImgIndex(selectedImgIndex - 1); // Cambia l'indice dell'immagine con quello precedente
        } else {
            setMainImg(img5); // Se siamo alla prima immagine passa all'ultima
            setSelectedImgIndex(4); // Imposta l'indice dell'ultima immagine
        }
    };

    // Riempimento di un array con tutte le immagini e iterazione delle immagini
    const productImgs = [img1, img2, img3, img4, img5].filter(img => img); // .filter(img => img) fa in modo che se un prodotto ha meno di 5 img vengano ciclate solo quelle esistenti
    const imgBox = productImgs.map((imgSrc, index) => (
        <div className={`box ${selectedImgIndex === index ? 'selected-img' : ''}`} onClick={() => handleBoxClick(imgSrc, index)} key={index}>
            <img src={imgSrc} alt={`${name} ${index + 1}`} />
        </div>
    ));

    // Ciclo for per riempire il select con opzioni da 1 a 30
    const options = [];
    for (let i = 1; i <= 30; i++) {
        options.push(<option key={i} value={i}>{i}</option>)
    }

    // Funzione per formattare la descrione
    const formatDescription = (text) => {
        const lines = text.split('\n'); // Dividi il testo se va a capo
        const formattedLines = lines.map((line, index) => { // Cicla le varie parti del testo
            const parts = line.split(':'); // Dividi il testo se ci sono i due punti
            if (parts.length >= 2) {
                const boldText = <strong key={index}>{parts[0]}</strong>; // Metti in grassetto la parte prima dei due punti
                return <p key={index}>{boldText}: {parts.slice(1).join(':')}</p>; // Scrivi la parte in grassetto
            } else {
                return <p key={index}>{line}</p>; // Scrivi la parte dopo i due punti
            }
        });
        return <div>{formattedLines}</div>; // Testo formattato
    };

    // Funzione per formattare le informazioni sul prodotto
    const formatInformation = (text) => {
        const lines = text.split('\n'); // Dividi il testo se va a capo
        const formattedLines = lines.map((line, index) => <p key={index}>{line}</p>); // Cicla le varie parti del testo
        return <div>{formattedLines}</div>; // Testo formattato
    };

    // Funzione che gestisce la chiusura e l'apertura degli accordion
    const handleAccordionClick = (index) => {
        setActiveAccordions((prevState) => {
            const isActive = prevState.includes(index);
            if (isActive) {
                return prevState.filter((i) => i !== index); // Rimuovi l'accordion dall'array degli accordion attivi
            } else {
                return [...prevState, index]; // Aggiungi l'ccordion all'array degli accordion attivi
            }
        });
    };

    // Funzione per ottenere l'id dell'utente dal database
    async function getUserId(token) {
        try {
            const response = await axios.get('https://ecommerce-vscs.onrender.com/api/user/', { // Risposta del server Django
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
    async function addToCart() {
        try {
            const token = localStorage.getItem('token'); // Ottieni il token JWT dal local storage
            const userId = await getUserId(token); // ID dell'utente ottenuto dalla funzione getUserId()
            const productQuantity = parseInt(document.querySelector('.quantity-value').textContent);

            const headers = {
                'Authorization': `Bearer ${token}` // Imposta il token JWT come header della richiesta
            };

            // Oggetto che contiene i dati del prodotto aggiunto al carrello
            const productData = {
                product_id: item_id,
                name: name,
                img: img1,
                price: price,
                productQuantity: productQuantity,
            };

            // Oggetto che condiene i parametri per la richiesta al server
            const requestData = {
                user_id: userId,
                items: productData,
            }

            const response = await axios.post('https://ecommerce-vscs.onrender.com/api/cart/add-to-cart/', requestData, { headers }); // Risposta del server
            navigate('/cart?addToCart=true'); // Reindirizza l'utente al carrello
        } catch (error) {
            console.error('Errore while adding to cart:', error); // Errore nell'aggiunta del prodotto al carrello
        }
    };

    // Funzione che incrementa la quantità
    function incQuantity() {
        let quantity = document.querySelector('.quantity');
        let value = document.querySelector('.quantity-value');

        let newQuantity = parseInt(quantity.textContent);

        if (newQuantity < 10) {
            newQuantity++;
        }
        value.innerHTML = newQuantity;
    }

    // Funzione che decrementa la quantità
    function decQuantity() {
        let quantity = document.querySelector('.quantity');
        let value = document.querySelector('.quantity-value');

        let newQuantity = parseInt(quantity.textContent);

        if (newQuantity > 1) {
            newQuantity--;
        }
        value.innerHTML = newQuantity;
    }

    // Funzione per ottenere l'id dell'utente dal database
    async function getUserIdForRedirect(token) {
        try {
            const response = await axios.get('https://ecommerce-vscs.onrender.com/api/user/', { // Risposta del server Django
                headers: {
                    'Authorization': `Bearer ${token}` // Imposta il token JWT come header della richiesta
                }
            });
            return response.data.user_id; // Restituisci l'id dell'utente come risultato della funzione
        } catch (error) {
            console.error('Failed to fetch user data:', error); // Errore nella fetch dei dati
        }
    }

    async function redirectToProductCheckout() {
        const token = localStorage.getItem('token'); // Prende il token JWT dal local storage
        const userId = await getUserIdForRedirect(token);
        navigate(`/product-checkout/${userId}`, { state: { item_id: item_id, name: name, price: price, img: img1 } });
    }

    if (!isMobileView) {
        return (
            <>
                <Navbar />
                <div className="product-container">
                    <div className="product-img-container">
                        <div className="other-imgs-container">
                            {imgBox}
                        </div>
                        <div className="product-img">
                            <img src={mainImg || img1} alt={name} />
                        </div>
                    </div>
                    <div className="product-info-container">
                        <h2>{name}</h2>
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
                        <p className="product-price">€ {price}</p>
                        <div className="product-size">
                            <p>Seleziona la taglia: <span>1 TB</span></p>
                            <div className="size-container">
                                <div className="size">256 GB</div>
                                <div className="size">512 GB</div>
                                <div className="size">1 TB</div>
                            </div>
                        </div>
                        <div className="product-color">
                            <p>Seleziona il colore: <span>Titanio Nero</span></p>
                            <div className="colors-container">
                                <div className="color">
                                    <img src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-pro-finish-blacktitanium-202309?wid=204&amp;hei=204&amp;fmt=jpeg&amp;qlt=90&amp;.v=1692895384718" />
                                </div>
                                <div className="color">
                                    <img src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-pro-finish-bluetitanium-202309?wid=204&amp;hei=204&amp;fmt=jpeg&amp;qlt=90&amp;.v=1692895385157" />
                                </div>
                                <div className="color">
                                    <img src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-pro-finish-naturaltitanium-202309?wid=204&amp;hei=204&amp;fmt=jpeg&amp;qlt=90&amp;.v=1692895385156" />
                                </div>
                                <div className="color">
                                    <img src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-pro-finish-whitetitanium-202309?wid=204&amp;hei=204&amp;fmt=jpeg&amp;qlt=90&amp;.v=1692895385155" />
                                </div>
                            </div>
                        </div>
                        <div className="product-quantity">
                            <span>Quantità: </span>
                            <div className="quantity">
                                <button className="dec-quantity" onClick={decQuantity}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash" viewBox="0 0 16 16">
                                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                    </svg>
                                </button>
                                <span className="quantity-value">1</span>
                                <button className="inc-quantity" onClick={incQuantity}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="product-btn-container">
                            <button className="add-to-cart-btn" onClick={addToCart}>
                                Aggiungi al Carrello
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart2" viewBox="0 0 16 16">
                                    <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                                </svg>
                            </button>
                            <button className="buy-now-btn" onClick={redirectToProductCheckout}>
                                Acquista Ora
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                                </svg>
                            </button>
                        </div>
                        <div className="shipping-data">
                            <div className="shipping-price">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-truck" viewBox="0 0 16 16">
                                    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                                </svg>
                                <div className="shipping-text">
                                    <p className="shipping-title">Spedizione gratuita</p>
                                    <p className="shipping-info">4-5 Giorni Lavorativi</p>
                                </div>
                            </div>
                            <div className="reimbursement">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5" />
                                </svg>
                                <div className="reimbursement-text">
                                    <p className="reimbursement-title">Politica di rimborso</p>
                                    <p className="reimbursement-info">Consulta la nostra politica di rimborso</p>
                                </div>
                            </div>
                            <div className="purchase">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shield-check" viewBox="0 0 16 16">
                                    <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
                                    <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                </svg>
                                <div className="purchase-text">
                                    <p className="purchase-title">Seicurezza negli acquisti</p>
                                    <p className="purchase-info">
                                        <span>
                                            Pagamenti sicuri
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                                            </svg>
                                        </span>
                                        <span>
                                            Servizio clienti
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                                            </svg>
                                        </span>
                                        <span>
                                            Protezione della privacy
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                                            </svg>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="product-accordion-container">
                            <button className={activeAccordions.includes(1) ? "product-accordion product-accordion-active" : "product-accordion"} onClick={() => handleAccordionClick(1)}>Descrizione Prodotto</button>
                            <div className="product-accordion-panel" style={{ maxHeight: activeAccordions.includes(1) ? '200px' : '0', padding: activeAccordions.includes(1) ? '16px 20px' : '0 20px' }}>
                                {formatDescription(description)}
                            </div>
                            <button className={activeAccordions.includes(2) ? "product-accordion product-accordion-active" : "product-accordion"} onClick={() => handleAccordionClick(2)}>Informazioni sul Prodotto</button>
                            <div className="product-accordion-panel" style={{ maxHeight: activeAccordions.includes(2) ? '200px' : '0', padding: activeAccordions.includes(2) ? '16px 20px' : '0 20px' }}>
                                {formatInformation(information)}
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
                <div className="product-container">
                    <div className="product-img-container">
                        <div className="other-imgs-container">
                            {imgBox}
                        </div>
                        <div className="product-img" onTouchStart={(e) => { touchStartX = e.changedTouches[0].screenX; }}  onTouchEnd={(e) => { touchEndX = e.changedTouches[0].screenX; if (touchStartX - touchEndX > 50) { handleSwipeLeft(); } else if (touchEndX - touchStartX > 50) { handleSwipeRight(); } }}>
                            <img src={mainImg || img1} alt={name} />
                        </div>
                    </div>
                    <div className="product-info-container">
                        <h2>{name}</h2>
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
                        <p className="product-price">€ {price}</p>
                        <div className="product-size">
                            <p>Seleziona la taglia: <span>1 TB</span></p>
                            <div className="size-container">
                                <div className="size">256 GB</div>
                                <div className="size">512 GB</div>
                                <div className="size">1 TB</div>
                            </div>
                        </div>
                        <div className="product-color">
                            <p>Seleziona il colore: <span>Titanio Nero</span></p>
                            <div className="colors-container">
                                <div className="color">
                                    <img src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-pro-finish-blacktitanium-202309?wid=204&amp;hei=204&amp;fmt=jpeg&amp;qlt=90&amp;.v=1692895384718" />
                                </div>
                                <div className="color">
                                    <img src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-pro-finish-bluetitanium-202309?wid=204&amp;hei=204&amp;fmt=jpeg&amp;qlt=90&amp;.v=1692895385157" />
                                </div>
                                <div className="color">
                                    <img src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-pro-finish-naturaltitanium-202309?wid=204&amp;hei=204&amp;fmt=jpeg&amp;qlt=90&amp;.v=1692895385156" />
                                </div>
                                <div className="color">
                                    <img src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-pro-finish-whitetitanium-202309?wid=204&amp;hei=204&amp;fmt=jpeg&amp;qlt=90&amp;.v=1692895385155" />
                                </div>
                            </div>
                        </div>
                        <div className="product-quantity">
                            <span>Quantità: </span>
                            <div className="quantity">
                                <button className="dec-quantity" onClick={decQuantity}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash" viewBox="0 0 16 16">
                                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                    </svg>
                                </button>
                                <span className="quantity-value">1</span>
                                <button className="inc-quantity" onClick={incQuantity}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="product-btn-container">
                            <button className="add-to-cart-btn product-add-to-cart-btn" onClick={addToCart}>
                                Aggiungi al Carrello
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart2" viewBox="0 0 16 16">
                                    <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                                </svg>
                            </button>
                            <button className="buy-now-btn" onClick={redirectToProductCheckout}>
                                Acquista Ora
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                                </svg>
                            </button>
                        </div>
                        <div className="shipping-data">
                            <div className="shipping-price">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-truck" viewBox="0 0 16 16">
                                    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                                </svg>
                                <div className="shipping-text">
                                    <p className="shipping-title">Spedizione gratuita</p>
                                    <p className="shipping-info">4-5 Giorni Lavorativi</p>
                                </div>
                            </div>
                            <div className="reimbursement">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5" />
                                </svg>
                                <div className="reimbursement-text">
                                    <p className="reimbursement-title">Politica di rimborso</p>
                                    <p className="reimbursement-info">Consulta la nostra politica di rimborso</p>
                                </div>
                            </div>
                            <div className="purchase">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shield-check" viewBox="0 0 16 16">
                                    <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
                                    <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                                </svg>
                                <div className="purchase-text">
                                    <p className="purchase-title">Seicurezza negli acquisti</p>
                                    <p className="purchase-info">
                                        <span>
                                            Pagamenti sicuri
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                                            </svg>
                                        </span>
                                        <span>
                                            Servizio clienti
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                                            </svg>
                                        </span>
                                        <span>
                                            Protezione della privacy
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                                            </svg>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="product-accordion-container">
                            <button className={activeAccordions.includes(1) ? "product-accordion product-accordion-active" : "product-accordion"} onClick={() => handleAccordionClick(1)}>Descrizione Prodotto</button>
                            <div className="product-accordion-panel" style={{ maxHeight: activeAccordions.includes(1) ? '200px' : '0', padding: activeAccordions.includes(1) ? '16px 0' : '0' }}>
                                {formatDescription(description)}
                            </div>
                            <button className={activeAccordions.includes(2) ? "product-accordion product-accordion-active" : "product-accordion"} onClick={() => handleAccordionClick(2)}>Informazioni sul Prodotto</button>
                            <div className="product-accordion-panel" style={{ maxHeight: activeAccordions.includes(2) ? '200px' : '0', padding: activeAccordions.includes(2) ? '16px 0' : '0' }}>
                                {formatInformation(information)}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Product;
