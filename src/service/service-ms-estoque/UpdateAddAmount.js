import { apiStock } from './ApiStock';

export default async function updateAddAmount(token, id_item) {
    try {
        const response = await apiStock.patch(`/estoque/${id_item}/quantidade`,
            1
            ,
            {
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json"
                }
                
            })

        return response.data;
    } catch (error) {
        console.log(error)
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}