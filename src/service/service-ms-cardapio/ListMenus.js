import { apiMenu } from "./ApiMenu";

export default async function listMenu(token) {
    try{
        const response = await apiMenu.get(`/api/v1/cardapios/listar`, {
            headers: {
                Authorization: `${token}`
            }
        })

        return response.data;
    }catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}