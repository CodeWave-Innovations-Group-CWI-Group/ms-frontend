import { apiMenu } from "./ApiMenu";

export default async function createMenu(menuData) {
    try{
        const response = await apiMenu.post(`/api/v1/cardapios`, menuData, {
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