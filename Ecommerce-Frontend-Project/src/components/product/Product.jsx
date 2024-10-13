

// import { Link } from 'react-router-dom';
// import AddToCart from "../addToCart/AddToCart";
// import './product.css';

// const Product = ({ product }) => (
//   <div className="product-item">
//     <Link to={`/product/${product.id}`}> 
//       <img className="product-image" src={product.image} alt={product.title} />
//     </Link>
//     <div className="product-details">
//       <div className="product-title">{product.title}</div>
//       <div className="buy-item">
//         <div className="product-price">Price: ${product.price}</div>
//         <AddToCart product={product} />
//       </div>
//     </div>
//   </div>
// );

// export default Product;


import { Link } from 'react-router-dom';
import AddToCart from "../addToCart/AddToCart";
import './product.css';

const Product = ({ product }) => (
  <div className="product-item">
    <Link to={`/product/${product.id}`}>
      <img className="product-image" src={product.image} alt={product.title} />
    </Link>
    <div className="product-details">
      <div className="product-title">{product.title}</div>
      <div className="buy-item">
        <div className="product-price">Price: ${product.price}</div>
        <AddToCart product={product} />
      </div>
    </div>
  </div>
);

export default Product;

