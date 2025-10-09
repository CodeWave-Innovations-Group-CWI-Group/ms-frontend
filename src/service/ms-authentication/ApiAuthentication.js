import axios from 'axios'

export const apiAuth = axios.create({
    baseURL: "https://22c4482ea69b.ngrok-free.app/api/v1/"
})
