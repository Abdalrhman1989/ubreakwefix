import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Checkout from './pages/Checkout';
import RepairPage from './pages/RepairPage';
import RepairsIndex from './pages/RepairsIndex';
import About from './pages/About';
import Contact from './pages/Contact';
import Business from './pages/Business';
import BusinessSignup from './pages/BusinessSignup';
import PaymentTerms from './pages/PaymentTerms';
import TermsAndConditions from './pages/TermsAndConditions';
import ShippingPolicy from './pages/ShippingPolicy';
import SellDevice from './pages/SellDevice';
import SellScreen from './pages/SellScreen';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import './index.css';

import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

import CookieConsent from './components/CookieConsent';

function App() {
    return (
        <LanguageProvider>
            <AuthProvider>
                <CartProvider>
                    <Router>
                        <div className="app-container">
                            <Navbar />
                            <CookieConsent />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/reparation/:modelId" element={<RepairPage />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/book" element={<Booking />} />
                                <Route path="/reparationer" element={<RepairsIndex />} />
                                <Route path="/om-os" element={<About />} />
                                <Route path="/kontakt" element={<Contact />} />
                                <Route path="/erhverv" element={<Business />} />
                                <Route path="/erhverv/opret" element={<BusinessSignup />} />
                                <Route path="/betalingsbetingelser" element={<PaymentTerms />} />
                                <Route path="/handelsbetingelser" element={<TermsAndConditions />} />
                                <Route path="/forsendelse" element={<ShippingPolicy />} />
                                <Route path="/saelg-enhed" element={<SellDevice />} />
                                <Route path="/saelg-skaerm" element={<SellScreen />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/profile" element={<Profile />} />
                            </Routes>
                            <Footer />
                        </div>
                    </Router>
                </CartProvider>
            </AuthProvider>
        </LanguageProvider>
    );
}

export default App;
