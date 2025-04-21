import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetchData from '../../hooks/useFetchData';
import Product from '../../components/product/product';
import Loader from '../../components/loader';
import urlConfig from '../../utils/urlConfig';
import './productListing.css';
import Pagination from '../../components/pagination/Pagination';

const ProductListing = () => {
  const { categoryName } = useParams();
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  // Generate API URL with page and limit params
  const url = categoryName
    ? `${urlConfig.ALL_PRODUCT_URL}?category=${categoryName}&page=${currentPage}&limit=${itemsPerPage}`
    : `${urlConfig.ALL_PRODUCT_URL}?page=${currentPage}&limit=${itemsPerPage}`;

  const { data, error, isLoading } = useFetchData(url, { data: [], totalPages: 1 });
  
  const products = Array.isArray(data.data) ? data.data : [];
  const totalPages = data.totalPages || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="product-list">
            {products.map((product) => (
              <Product key={product._id || product.id} product={product} />
            ))}
          </div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            paginate={paginate}
          />
        </>
      )}
    </div>
  );
};

export default ProductListing;





