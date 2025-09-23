import apiMeal from './ApiMeal';

export default async function findHistoryMeal(id_user) { //depois colocar pra token
    try{
        const response = await apiMeal.get(`/meal/user/meals/history/${id_user}`, { //depois tirar dos params pq vai nos headers
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