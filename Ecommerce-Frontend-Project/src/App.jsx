import { AuthProvider } from "./context/auth/AuthProvider";
import CartProvider from "./context/cart/CartProvider";
import AppRoutes from "./routes/AppRoutes";
import Payment from "./components/payment/Payment";
const App = () => {
  
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </>
  )
}

export default App;




