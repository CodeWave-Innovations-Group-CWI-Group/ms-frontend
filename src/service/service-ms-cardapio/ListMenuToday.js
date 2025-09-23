import { apiCardapio } from "./ApiCardapio";

export default async function listMenuToday(shift) {
    try{
        const response = await apiCardapio.get(`/api/v1/cardapios/hoje/${shift}`, {
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

