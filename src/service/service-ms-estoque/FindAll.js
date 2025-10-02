import { apiStock } from "./ApiStock";

export default async function FindAll(token) {
    try{
        const response = await apiStock.get('/estoque/listAll',  
        {
            headers: {
                Authorization: `${token}`
            }
        }
        );
        return response.data;
    }catch(error){
        throw error.response;
    }
}