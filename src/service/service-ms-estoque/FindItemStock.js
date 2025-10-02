import { apiStock } from './ApiStock';

export default async function findItemStock(token, id_item) {
    try{
        const response = await apiStock.get(`/estoque/${id_item}`, {
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