import apiMeal from './ApiMeal';

export default async function createMeal(id_user, id_menu) { //depois colocar pra token
    try{
        const response = await apiMeal.post(`/meal/create `, {id_menu, id_user} ,{
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