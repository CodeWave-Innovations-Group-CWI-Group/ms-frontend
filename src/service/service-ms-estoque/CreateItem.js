import { apiStock } from './ApiStock';

export default async function createItem(item) {
    try{
        const response = await apiStock.post(`/estoque/save`, item, {
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