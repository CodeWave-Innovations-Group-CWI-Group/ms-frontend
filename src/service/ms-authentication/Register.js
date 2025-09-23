import { apiAuth } from "./ApiAuthentication";

export default async function register_admin(name, email, password, course, token) {
    try {
        const response = await apiAuth.post('', {
            name: name,
            email: email,
            password: password,
            course: course
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}