import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/navbar";
import Card from "../components/card";
import Footer from "../components/footer";
import SearchBar from "../components/search_bar";
import "../components/css/search_page.css";

function SearchPage() {
    const location = useLocation(); // Hook location utilizzato per ricevere i dati della ricerca passati come stato
    const searchResult = location.state ? location.state.searchResult : []; // Se il server Django restituisce un o più prodotti vengono estratti in un array

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


    if (!isMobileView) {
        return (
            <>
                <Navbar />
                <div className="search-page-container">
                    <p className="search-results">Risultati della ricerca</p>
                    <div className="card-container">
                        {searchResult.map((product) => (
                            <Card
                                key={product.id}
                                product={product}
                            />
                        ))}
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
                <div className="search-page-container">
                    <p className="search-results">Risultati della ricerca</p>
                    <div className="card-container">
                        {searchResult.map((product) => (
                            <Card
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            </>
        );
    }
}

export default SearchPage;
