import axios from "axios";

export const apiStock = axios.create({
    baseURL: "https://ms-estoque.onrender.com"
})
