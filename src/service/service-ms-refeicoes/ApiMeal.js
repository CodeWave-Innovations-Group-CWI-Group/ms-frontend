import axios from 'axios'

export const apiRefeicoes = axios.create({
    baseURL: "https://ms-registros-de-refeicoes.onrender.com"
})
