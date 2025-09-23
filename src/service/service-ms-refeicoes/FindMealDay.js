import apiMeal from './ApiMeal';

export default async function findMealDay(dayMeal) {
    try{
        const response = await apiMeal.get(`/meal/day/${dayMeal}`, {
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