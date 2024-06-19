import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./css/bestseller.css";

function Bestseller() {
    const [bestsellerProducts, setBestsellerProducts] = useState([]);
    useEffect(() => {
        async function getBestsellerProducts() {
            try {
                const response = await axios.get('https://ecommerce-vscs.onrender.com/api/bestseller');
                setBestsellerProducts(response.data);
            } catch (error) {
                console.error("Error to fetch products: ", error);
            }
        }
        getBestsellerProducts();
    }, []);

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1281,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="bestseller-container">
            <div className="bestseller-title">
                <h2>Prodotti più venduti</h2>
                <p>Scopri i prodotti più popolari tra i nostri clienti</p>
            </div>
            <Slider {...settings}>
                {bestsellerProducts.map((product) => (
                    <Link to={`/product/${product.name}/${product.item_id}`} state={{ item_id: product.item_id, name: product.name, img1: product.img1, img2: product.img2, img3: product.img3, img4: product.img4, img5: product.img5, price: product.price, brand: product.brand, description: product.description, information: product.information }} className="bestseller-card-link">
                        <div className="bestseller-card" key={product.id}>
                            <div className="bestseller-card-img">
                                <img src={product.img1} alt={product.name} />
                            </div>
                            <div className="bestseller-card-data">
                                <h2>{product.name /* 20px weight: 600 */}</h2>
                                <p>€ {product.price /* 18px weight: 600 */}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </Slider>
        </div>
    );
}

export default Bestseller;
