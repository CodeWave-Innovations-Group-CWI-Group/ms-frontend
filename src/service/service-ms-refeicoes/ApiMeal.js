import axios from 'axios'

const apiMeal = axios.create({
    baseURL: "https://ms-registros-de-refeicoes.onrender.com"
})

export default apiMeal;