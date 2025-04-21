const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";
console.log(import.meta.env);
const  urlConfig = {
    CATEGORIES_URL: BASE_URL + "/api/products/categories",
    LOGIN_URL: BASE_URL + "/login",
    SIGNUP_URL: BASE_URL + "/signup",
    ALL_PRODUCT_URL: BASE_URL + "/api/products",
    ORDR_URL: BASE_URL + "/api/booking"
}


export default urlConfig;