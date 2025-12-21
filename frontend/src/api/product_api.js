import api from "./axios";

// export const getProducts = () => api.get("/products");
export const getProduct = (id,queryParams) => api.get(`/products/${id}`,{params:queryParams});
export const createProduct = (data) => api.post("/products", data);

export const getSellerProducts = (queryParams) => api.get("/seller/products",{params:queryParams});

export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const getProducts = (queryParams) =>
  api.get("/products", {
    params: queryParams,
  });

export const searchProducts = (queryParams) =>
  api.get("/products/search", {
    params: queryParams,
  });

  
export const updateProduct = (id, payload) =>
  api.put(`/seller/product/${id}`, payload); 