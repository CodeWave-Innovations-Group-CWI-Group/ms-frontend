import { apiCardapio } from "./ApiCardapio";

export default async function updateMenu(id_menu, menuData) {
    try{
        const response = await apiCardapio.patch(`/api/v1/cardapios/${id_menu}`, menuData, {
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


