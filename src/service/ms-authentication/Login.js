import { apiAuth } from "./ApiAuthentication";

export default async function login(email, password) {
    try {
        const response = await apiAuth.post('/auth/login/', {
            login: email,
            password: password
        })

        console.log(response)

        const { token, expire_at } = response.data;
        return {token, expire_at};
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}