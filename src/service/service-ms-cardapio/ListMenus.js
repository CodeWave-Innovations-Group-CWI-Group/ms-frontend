import { apiCardapio } from "./ApiCardapio";

export default async function listMenu(shift, date) {
    try{
        const response = await apiCardapio.get(`/api/v1/cardapios/listar`, {
            params: { shift, date },
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