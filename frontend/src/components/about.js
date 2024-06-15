import React from "react";
import Verified from "./img/verified.svg";
import "./css/about.css";

function About() {
    const aboutCardData = [
        { id: 0, img: "https://www.workitect.it/wp-content/uploads/2021/11/Desk-Sharing-ufficio.jpg", title: "Chi siamo", desc: "Un negozio online sviluppatto interamente da uno studente di informatica che vende prodotti tecnologici di qualsiasi tipo." },
        { id: 1, img: "https://storage.googleapis.com/elettronica-av.it/2020/10/top-ten-interbrand.png", title: "Prodotti dei migliori brand", desc: "Sul nostro sito puoi comprare qualsiasi prodotto dei marchi più famosi e presitgiosi." },
        { id: 2, img: Verified, title: "Shopping sicuro", desc: "Lo shopping sul nostro sito è completamente sicuro, utilizziamo metodi di pagamento sicuri verificati da Stripe."}
    ];

    return (
        <div className="about-container">
            <h2>Benvenuto sul nostro store tecnologico</h2>
            <p>Acquista i migliori prodotti tecnologici</p>
            <div className="about-card-container">
                {aboutCardData.map((card) => {
                    return (
                        <div className="about-card" key={card.id}>
                            <div className="about-card-img">
                                <img src={card.img} />
                            </div>
                            <div className="about-card-desc">
                                <h3>{card.title}</h3>
                                <p>{card.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default About;
