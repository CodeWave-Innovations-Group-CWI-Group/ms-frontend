import axios from 'axios'

export const apiAuth = axios.create({
    baseURL: "https://1736e818cd2a.ngrok-free.app/api/v1/"
})
