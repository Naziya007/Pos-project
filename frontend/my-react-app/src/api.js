import axios from "axios";

const API = axios.create({
  baseURL: "https://pos-project-goif.onrender.com", // replace with your backend URL
});
// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("adminToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registerAdmin = (data) => API.post("/auth/register", data);
export const loginAdmin = (data) => API.post("/auth/login", data);
export const loginStaffWithPin = (data) => API.post("/auth/pin-login", data);
// =======================
// AUTH APIs
// =======================
export const getProfile = () => API.get("/auth/profile");
export const logoutUser = () => API.post("/auth/logout");




// TABLE APIs
// =======================
export const createTable = (data) => API.post("/order-table/tables", data);
export const getTables = () => API.get("/order-table/tables");
export const updateTable = (tableId, data) =>
  API.put(`/order-table/tables/${tableId}`, data);
export const deleteTable = (tableId) => API.delete(`/order-table/tables/${tableId}`);

// =======================
// ORDER APIs
// =======================
export const createOrder = (data) => API.post("/order-table/orders", data);
export const getOrders = () => API.get("/order-table/orders");
export const updateOrder = (orderId, data) =>
  API.put(`/order-table/orders/${orderId}`, data);
export const deleteOrder = (orderId) => API.delete(`/order-table/orders/${orderId}`);

// =======================
// KOT / KDS APIs
// =======================
export const getAllKOT = () => API.get("/kot/all");
export const createKOT = (data) => API.post("/kot/create", data);
export const acceptKOT = (kotId) => API.put(`/kot/accept/${kotId}`);
export const startPreparing = (kotId) => API.put(`/kot/preparing/${kotId}`);
export const markReady = (kotId) => API.put(`/kot/ready/${kotId}`);
export const markServed = (kotId) => API.put(`/kot/served/${kotId}`);
// =======================
// INVENTORY APIs
// =======================
export const getAllProducts = () => API.get("/inventory");                  // fetch all products
export const getProduct = (id) => API.get(`/inventory/${id}`);              // fetch single product
export const createProduct = (data) => API.post("/inventory", data);        // add new product
export const updateProduct = (id, data) => API.put(`/inventory/${id}`, data); // update existing product
export const deleteProduct = (id) => API.delete(`/inventory/${id}`);   // delete product
//menu item s api
export const getMenu = (category) => API.get(`/menu/${category}`);
export const createMenuItem = (data) => API.post("/menu", data);
export const updateMenuItem = (id, data) => API.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => API.delete(`/menu/${id}`);
//waste management

export const getWaste = () => API.get("/waste");
export const createWaste = (data) => API.post("/waste", data);
export const updateWaste = (id, data) => API.put(`/waste/${id}`, data);
export const deleteWaste = (id) => API.delete(`/waste/${id}`);