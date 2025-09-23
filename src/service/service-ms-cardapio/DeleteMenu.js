import { apiCardapio } from "./ApiCardapio";

export default async function deleteMenu(id_menu) {
    try{
        const response = await apiCardapio.delete(`/api/v1/cardapios/${id_menu}`, {
            // headers: {
            //     Authorization: `Bearer ${token}`
            // }
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