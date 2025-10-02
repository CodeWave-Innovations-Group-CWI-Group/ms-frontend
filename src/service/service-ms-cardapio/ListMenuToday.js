import { apiMenu } from "./ApiMenu";

export default async function listMenuToday(shift) {
    try{
        const response = await apiMenu.get(`/api/v1/cardapios/hoje?turno=${shift}`, {
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

