import apiMeal from './ApiMeal';

export default async function findHistoryMeal(token) { 
    try{
        const response = await apiMeal.get(`/meal/user/meals/history/`, { 
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data.mealsUser;
    }catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error("Erro no servidor. Tente novamente")
        }
    }
}