import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/header/Header';
import NotFound from '../pages/notFound/NotFound';
import useFetchData from '../hooks/useFetchData';
import ProductListing from '../pages/productListing/ProductListing';
import CartItems from '../pages/cartItems/CartItems';
import Signup from '../pages/signup/Signup';
import Login from '../pages/login/Login';
import Checkout from '../pages/checkout/Checkout';
import ForgotPassword from '../pages/forgotPassword/ForgotPassword';
import ProductDetail from '../../src/components/productDetail/ProductDetail';
import Payment from '../components/payment/Payment';
const AppRoutes = () => {

  const {data: categories, error, isLoading } = useFetchData('https://fakestoreapi.com/products/categories', []);

  console.log(categories);

  return (
      <>
      
        <Router>
            <Header categories={categories} isLoading={isLoading}/>
            <Routes>
                <Route path='/' element={<ProductListing />} />
                <Route path='/cart' element={<CartItems />} />
                <Route  path='/products/:categoryName' element={<ProductListing />}/>
                <Route path='/product/:id' element={<ProductDetail />} />
                <Route path='*' element={<NotFound />} />
                <Route path="/signup" element={<Signup />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/checkout" element={<Checkout />}></Route>
                <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
                <Route path='/payment' element={<Payment />} /> 
            </Routes>
        </Router>
      </>
  )

}

export default AppRoutes;