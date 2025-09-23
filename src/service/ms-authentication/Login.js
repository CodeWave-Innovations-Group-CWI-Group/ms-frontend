import { apiAuth } from "./ApiAuthentication";

export default async function login(email, password) {
    try {
        const response = await apiAuth.post('', {
            email: email,
            password: password
        })

        const { token } = response.data;
        return {token};
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}