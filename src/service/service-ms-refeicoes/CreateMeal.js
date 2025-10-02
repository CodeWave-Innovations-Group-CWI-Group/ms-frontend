import apiMeal from "./ApiMeal";

export default async function createMeal(token, id_menu, turno) {
    try{
        const response = await apiMeal.post(`/meal/create`, {menuId: id_menu, shift: turno} ,{
            headers: {
                Authorization: `Bearer ${token}`
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