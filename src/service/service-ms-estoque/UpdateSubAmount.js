import { apiStock } from './ApiStock';

export default async function updateSubAmount(token, id_item) {
    try {
        const response = await apiStock.patch(`/estoque/${id_item}/baixar`, 1, {
            headers: {
                Authorization: `${token}`,
                "Content-Type": "application/json"
            }
        })

        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}
