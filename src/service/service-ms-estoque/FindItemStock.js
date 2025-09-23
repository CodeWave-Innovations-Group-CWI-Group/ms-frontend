import { apiStock } from './ApiStock';

export default async function findItemStock(id_item) {
    try{
        const response = await apiStock.get(`/estoque/${id_item}`, {
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