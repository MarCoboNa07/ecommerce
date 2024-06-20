import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import beatsStudioProBlack from "../components/img/beats_studio_pro_black.png";
import "./css/home_banner.css";
import SearchBar from "./search_bar";

function HomeBanner() {
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
            <div className="home-banner-container">
                <div className="home-banner-left">
                    <div className="home-banner-left-content">
                        <p>Store per tecnologici esigenti</p>
                        <div className="banner-title">
                            <h2>Nuovi Prodotti Tech</h2>
                            <h2>Dei Migliori Brand</h2>
                        </div>
                        <Link to="/explore" className="home-banner-link">
                            Mostra Prodotti
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                            </svg>
                        </Link>
                    </div>
                </div>
                <div className="home-banner-right">
                    <img src={beatsStudioProBlack} />
                </div>
            </div>
        );
    } else {
        return (
            <div className="mobile-home-banner">
                <SearchBar />
                <div className="mobile-home-banner-content">
                    <div className="home-banner-left">
                        <div className="home-banner-left-content">
                            <p>Store per tecnologici esigenti</p>
                            <div className="banner-title">
                                <h2>Nuovi Prodotti Tech</h2>
                                <h2>Dei Migliori Brand</h2>
                            </div>
                            <Link to="/explore" className="home-banner-link">
                                Mostra Prodotti
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomeBanner;
