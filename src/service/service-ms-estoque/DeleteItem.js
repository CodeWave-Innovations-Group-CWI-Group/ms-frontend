import { apiStock } from './ApiStock';

export default async function deleteItem(id_item) {
    try{
        const response = await apiStock.delete(`/estoque/${id_item}`, {
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