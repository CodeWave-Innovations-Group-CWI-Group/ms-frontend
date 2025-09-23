import axios from "axios";

export const apiEstoque = axios.create({
    baseURL: "https://ms-estoque.onrender.com"
})
