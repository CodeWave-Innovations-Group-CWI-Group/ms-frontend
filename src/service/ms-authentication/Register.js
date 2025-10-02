import { apiAuth } from "./ApiAuthentication";

export default async function Register(name, userName, phoneNumber, email, password, confirmPassword) {
    try {
        const response = await apiAuth.post('/auth/register/', {
            name: name,
            username: userName,
            email: email,
            phone_number: phoneNumber,
            password: password,
            confirm_password: confirmPassword
        })

        return response.data;
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            throw new Error(data.message || JSON.stringify(data) || `Erro ${status}: conflito ao registrar`);
        } else {
            throw new Error("Erro no servidor. Tente novamente");
        }
    }
}