import { apiMenu } from "./ApiMenu";

export default async function listMenu(shift, date) {
    try{
        const response = await apiMenu.get(`/api/v1/cardapios/listar?data=${date}&turno=${shift}`, {
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