import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/products";

export const getProducts = () => axios.get(API_URL);
export const getProduct = (id: string) => axios.get(`${API_URL}/${id}`);
export const createProduct = (data: any) => axios.post(API_URL, data);
export const updateProduct = (id: string, data: any) => axios.put(`${API_URL}/${id}`, data);
export const patchProduct = (id: string, data: any) => axios.patch(`${API_URL}/${id}`, data);
export const deleteProduct = (id: string) => axios.delete(`${API_URL}/${id}`);
