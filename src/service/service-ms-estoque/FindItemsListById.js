import { apiStock } from './ApiStock';

export default async function findItemListById(token, listIdItens) {
    try{
        const response = await apiStock.post(`/estoque/listaDeItens`, listIdItens, {
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