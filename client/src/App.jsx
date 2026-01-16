import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from './context/LanguageContext';
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
import ReturnPolicy from './pages/ReturnPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import CookiePolicy from './pages/CookiePolicy';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import SellDevice from './pages/SellDevice';
import SellScreen from './pages/SellScreen';
import Microsoldering from './pages/Microsoldering';
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
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBrands from './pages/admin/AdminBrands';
import AdminModels from './pages/admin/AdminModels';
import AdminRepairs from './pages/admin/AdminRepairs';
import AdminBookings from './pages/admin/AdminBookings';
import AdminShopOrders from './pages/admin/AdminShopOrders';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserProfile from './pages/admin/AdminUserProfile';
import BusinessDashboard from './pages/BusinessDashboard';
import AdminBusinessRequests from './pages/admin/AdminBusinessRequests';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSellRequests from './pages/admin/AdminSellRequests';
import AdminScreenRequests from './pages/admin/AdminScreenRequests';
import AdminConditions from './pages/admin/AdminConditions';
import AdminPricing from './pages/admin/AdminPricing';


import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import CustomPC from './pages/CustomPC';

import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';

import CookieConsent from './components/CookieConsent';
import TawkTo from './components/TawkTo';

function Layout({ children }) {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    const { language } = useLanguage();

    return (
        <div className="app-container">
            <Helmet htmlAttributes={{ lang: language }} />
            {/* TopBar might be needed, adding it if not admin */}
            {/* TopBar removed as requested */}
            {!isAdminRoute && <Navbar />}
            {!isAdminRoute && <CookieConsent />}
            <TawkTo />
            {children}
            {!isAdminRoute && <Footer />}
        </div>
    );
}

import { HelmetProvider } from 'react-helmet-async';

function App() {
    return (
        <LanguageProvider>
            <AuthProvider>
                <CartProvider>
                    <HelmetProvider>
                        <Router>
                            <Layout>
                                <Routes>
                                    {/* Public Routes */}
                                    <Route path="/" element={<Home />} />
                                    <Route path="/reparation/:modelId" element={<RepairPage />} />
                                    <Route path="/checkout" element={<Checkout />} />
                                    <Route path="/checkout/success" element={<Checkout />} />
                                    <Route path="/book" element={<Booking />} />
                                    <Route path="/reparationer" element={<RepairsIndex />} />
                                    <Route path="/om-os" element={<About />} />
                                    <Route path="/kontakt" element={<Contact />} />
                                    <Route path="/erhverv" element={<Business />} />
                                    <Route path="/erhverv/opret" element={<BusinessSignup />} />
                                    <Route path="/betalingsbetingelser" element={<PaymentTerms />} />
                                    <Route path="/handelsbetingelser" element={<TermsAndConditions />} />
                                    <Route path="/retur" element={<ReturnPolicy />} />
                                    <Route path="/forsendelse" element={<ShippingPolicy />} />
                                    <Route path="/cookie-politik" element={<CookiePolicy />} />
                                    <Route path="/blog" element={<Blog />} />
                                    <Route path="/blog/:slug" element={<BlogPost />} />
                                    <Route path="/saelg-enhed" element={<SellDevice />} />
                                    <Route path="/saelg-skaerm" element={<SellScreen />} />
                                    <Route path="/microsoldering" element={<Microsoldering />} />

                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/business/dashboard" element={<BusinessDashboard />} />

                                    {/* Shop Routes */}
                                    <Route path="/shop" element={<Shop />} />
                                    <Route path="/shop/product/:id" element={<ProductDetails />} />
                                    <Route path="/cart" element={<Cart />} />
                                    <Route path="/custom-pc" element={<CustomPC />} />


                                    {/* Admin Routes */}
                                    <Route path="/admin" element={<AdminLayout />}>
                                        <Route index element={<AdminDashboard />} />
                                        <Route path="brands" element={<AdminBrands />} />
                                        <Route path="models" element={<AdminModels />} />
                                        <Route path="repairs" element={<AdminRepairs />} />
                                        <Route path="bookings" element={<AdminBookings />} />
                                        <Route path="shop-orders" element={<AdminShopOrders />} />
                                        <Route path="business-requests" element={<AdminBusinessRequests />} />
                                        <Route path="settings" element={<AdminSettings />} />
                                        <Route path="users" element={<AdminUsers />} />
                                        <Route path="users/:id" element={<AdminUserProfile />} />
                                        <Route path="profile" element={<AdminProfile />} />
                                        <Route path="products" element={<AdminProducts />} />
                                        <Route path="products/new" element={<AdminProductForm />} />
                                        <Route path="products/edit/:id" element={<AdminProductForm />} />
                                        <Route path="categories" element={<AdminCategories />} />
                                        <Route path="sell-requests" element={<AdminSellRequests />} />
                                        <Route path="screen-requests" element={<AdminScreenRequests />} />
                                        <Route path="conditions" element={<AdminConditions />} />
                                        <Route path="pricing" element={<AdminPricing />} />
                                    </Route>
                                </Routes>
                            </Layout>
                        </Router>
                    </HelmetProvider>
                </CartProvider>
            </AuthProvider>
        </LanguageProvider>
    );
}

export default App;
