import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import Card from "../components/card";
import Footer from "../components/footer";
import "../components/css/explore.css";

function Explore() {
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);
    const [bestsellerProducts, setBestsellerProducts] = useState([]);

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
        async function getBestsellerProducts() {
            try {
                const response = await axios.get('/api/bestseller/');
                setBestsellerProducts(response.data);
            } catch (error) {
                console.error("Error to fetch products: ", error);
            }
        }
        getBestsellerProducts();
    }, []);

    if (!isMobileView) {
        return (
            <>
                <Navbar />
                <div className="card-container">
                    {bestsellerProducts.map((product) => {
                        return (
                            <Card
                                key={product.id}
                                product={product}
                            />
                        );
                    })}
                </div>
                <Footer />
            </>
        );
    } else {
        return (
            <>
                <Navbar />
                <div className="card-container">
                    {bestsellerProducts.map((product) => {
                        <Card
                            key={product.id}
                            product={product}
                        />
                    })}
                </div>
            </>
        );
    }
}

export default Explore;
