import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ScrollToTop from "./components/scroll_to_top";
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import SearchPage from "./pages/search_page";
import Product from "./pages/product";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import ProductCheckout from "./pages/product_checkout";
import Payment from "./pages/payment";
import ProductPayment from "./pages/product_payment";
import PaymentStatus from "./pages/payment_status";
import ProfileAccount from "./pages/profile_account";
import ProfilePassword from "./pages/profile_password";
import ProfileNotifications from "./pages/profile_notifications";
import ProfileMobileApp from "./pages/profile_mobile_app";
import Explore from "./pages/explore";
import Contact from "./pages/contact";
import './App.css';

const stripePromise = loadStripe('pk_test_51P8oOzRtfkaY6Tw2Zk6ZcKeutlzpApH9WwaCW4coqzFwBf8iXlECLNbk6XQsBmA5z93QuZPErfuHWXDEUYgyzCXp00pEWJEBEp');

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:productName/:itemId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout/:userId" element={<Checkout />} />
        <Route path="/product-checkout/:userId" element={<ProductCheckout />} />
        <Route path="/payment/:userId" element={<Payment />} />
        <Route path="/product-payment/:userId" element={<ProductPayment />} />
        <Route path="/payment-status" element={<Elements stripe={stripePromise}><PaymentStatus /></Elements>} />
        <Route path="/profile/account" element={<ProfileAccount />} />
        <Route path="/profile/password" element={<ProfilePassword />} />
        <Route path="/profile/notifications" element={<ProfileNotifications />} />
        <Route path="/profile/mobile-app" element={<ProfileMobileApp />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
