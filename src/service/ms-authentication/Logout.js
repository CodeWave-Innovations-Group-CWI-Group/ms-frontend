import { apiAuth } from "./ApiAuthentication";

export default async function logout(token) {
    try {
        await apiAuth.post('/auth/logout/', {}, {
            headers: {
                Authorization: `${token}`
            }
        })
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}