import axios from 'axios'

export const apiMenu = axios.create({
    baseURL: "https://ms-cardapio.onrender.com"
})
