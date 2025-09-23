import axios from 'axios'

export const apiCardapio = axios.create({
    baseURL: "https://ms-cardapio.onrender.com/docs"
})
