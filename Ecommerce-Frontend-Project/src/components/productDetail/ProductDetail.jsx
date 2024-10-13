import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AddToCart from '../addToCart/AddToCart';
import Loader from '../../components/loader';
import './productDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div>Error loading product details: {error}</div>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <img src={product.image} alt={product.title} className="product-detail-image" />
        <div className="product-detail-info">
          <p className="product-detail-title">{product.title}</p>
          <p className="product-detail-description">{product.description}</p>
          <div className="product-detail-price">Price: ${product.price.toFixed(2)}</div>
          <div className="product-detail-rating">
            Rating: {product.rating.rate} ({product.rating.count} reviews)
          </div>
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
