import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from '../components/header/Header';
import NotFound from '../pages/notFound/NotFound';
import useFetchData from '../hooks/useFetchData';
import ProductListing from '../pages/productListing/ProductListing';
import CartItems from '../pages/cartItems/CartItems';
import Signup from '../pages/signup/Signup';
import Login from '../pages/login/Login';
import urlConfig from '../utils/urlConfig';
import useAuth from '../context/auth/useAuth';
import Checkout from '../pages/checkout/Checkout';
import ForgotPassword from '../pages/forgotPassword/ForgotPassword';
import ProductDetail from '../../src/components/productDetail/ProductDetail';
import Payment from '../components/payment/Payment';

import { useEffect } from 'react';

const AppRoutesContent = () => {
  const { data: categories, isLoading } = useFetchData(urlConfig.CATEGORIES_URL, []);
  const { user } = useAuth();
  const location = useLocation();

  
  const hideHeaderRoutes = ['/login', '/signup', '/forgotPassword'];

  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && user && (
        <Header categories={categories?.data} isLoading={isLoading} />
      )}
      <Routes>
        <Route path="/" element={<ProductListing />} />
        <Route path="/cart" element={<CartItems />} />
        <Route path="/products/:categoryName" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <AppRoutesContent />
    </Router>
  );
};

export default AppRoutes;
