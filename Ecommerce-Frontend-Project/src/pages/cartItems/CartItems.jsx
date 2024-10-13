import CartItem from "../../components/cartItem/CartItem";
import { useNavigate } from "react-router-dom"; 
import { useCart } from "../../context/cart/useCart";

import './cartItems.css';

const cartItems = () => {
    const { cart } = useCart();
 
    const netTotalPrice = Object.values(cart).reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const navigate = useNavigate(); 

    const handleCheckout = () => {
        navigate('/checkout'); 
    };

    return (
        <>
           
            <h2 className="cart-items-heading">Your cart Items</h2>
            <ul className="cart-items">
                {
                    Object.values(cart).map((item, index) => {
                        return <CartItem key={`cart-item-${index}`} cartData={item} />
                    })
                }
            </ul>
            <div className="cart-net-total">
                <p className="cart-net-total-label">Net Total</p>
                <p className="cart-net-total-price">${netTotalPrice.toFixed(2)}</p>
            </div>
            <div className="cart-checkout">
            <button onClick={handleCheckout}>CheckOut</button>
            </div>
            
        </>
    )
}

export default cartItems;