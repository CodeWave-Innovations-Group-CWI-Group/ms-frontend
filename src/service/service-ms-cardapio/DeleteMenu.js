import { apiMenu } from "./ApiMenu";

export default async function deleteMenu(token, id_menu) {
    try{
        const response = await apiMenu.delete(`/api/v1/cardapios/${id_menu}`, {
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