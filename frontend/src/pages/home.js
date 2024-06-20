import React, { useState, useEffect } from "react";
import Navbar from '../components/navbar';
import HomeBanner from "../components/home_banner";
import Bestseller from "../components/bestseller";
import About from "../components/about";
import Footer from "../components/footer";
import "../components/css/home.css";

function Home() {
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
                <HomeBanner />
                <Bestseller />
                <About />
                <Footer />
            </>
        );
    } else {
        return (
            <>
                <Navbar />
                <HomeBanner />
                <Bestseller />
                <About />
            </>
        );
    }
}

export default Home;
