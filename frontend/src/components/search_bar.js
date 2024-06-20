import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Product from "../pages/product";
import './css/search_bar.css';

function SearchBar() {
    const [searchItem, setSearchItem] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const navigate = useNavigate();

    // Funzione che permette di modificare gli input
    function handleChange(e) {
        setSearchItem(e.target.value);
    }

    // Funzione che invia una richiesta al server Django e restituisce la risposta
    async function handelSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.get(`https://ecommerce-vscs.onrender.com/api/search/?q=${searchItem}`); // Risposta del server
            setSearchResult(response.data);
            navigate(`/search?q=${searchItem}`, { state: { searchResult: response.data } }); // Reindirizza alla pagina dei prodotti e passa i prodotti inviati dal server Django come stato
        } catch (error) {
            console.error("Error searching for products: ", error); // Errore nella ricerca dei prodotti restituito dal server Django
        }
    }

    return (
        <>
            <form onSubmit={handelSubmit}>
                <div className="search-bar-container">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Cerca"
                        onChange={handleChange}
                    />
                </div>
            </form>
            {searchResult && <Product product={searchResult} />}
        </>
    );
}

export default SearchBar;
