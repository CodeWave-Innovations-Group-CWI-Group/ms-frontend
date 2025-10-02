import { useContext, useEffect, useState } from "react"
import findHistoryMeal from "../../service/service-ms-refeicoes/FindHistoryMeal";
import findMealDay from "../../service/service-ms-refeicoes/FindMealDay";
import listMenuToday from "../../service/service-ms-cardapio/ListMenuToday";
import findItemListById from "../../service/service-ms-estoque/FindItemsListById";
import createMeal from "../../service/service-ms-refeicoes/CreateMeal";
import { AuthContext } from "../../context/AuthContext";

export default function MealComponent() {

    const [historyUser, setHistoryUser] = useState([]);
    const [historyDay, setHistoryDay] = useState([]);
    const [showCreateMeal, setShowCreateMeal] = useState(false);
    const [selectedDate, setSelectedDate] = useState("")
    const [historyTotalDay, setHistoryTotalDay] = useState("");
    const [selectedTurno, setSelectedTurno] = useState("");
    const [menuTurno, setMenuTurno] = useState();
    const [menuItensDetalhados, setMenuItensDetalhados] = useState({
        prato_principal: [],
        acompanhamentos: [],
        saladas: [],
        sobremesas: [],
        bebidas: []
    });
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState("");
    const {token} = useContext(AuthContext);


    const handleShowCreatEMeal = () => {
        if (showCreateMeal === false) {
            setShowCreateMeal(true);
        } else {
            setShowCreateMeal(false);
        }
    }

    async function handleFindMealDay(day) {
        const selectDay = await findMealDay(token, day);
        setHistoryDay(selectDay.historyMelsDay);
        setHistoryTotalDay(selectDay.numberMealsDay);
        console.log(selectDay)
    }

    useEffect(() => {
        async function findHistory() {
            try {
                const history = await findHistoryMeal(token);
                setHistoryUser(history);
                console.log(history)
            } catch (error) {
                console.error();
            }
        }
        findHistory()
    }, [])

    useEffect(() => {
        async function findMenuToday() {
            try {
                const res = await listMenuToday(selectedTurno);
                console.log(res);
                setMenuTurno(res || []);
            } catch (error) {
                console.log(error)
                setMenuTurno([]);

            }
        }

        findMenuToday()
    }, [selectedTurno])

    async function getItensPorIds(ids) {
        if (!ids || ids.length === 0) return [];
        try {
            const itens = await findItemListById(token, ids);
            return itens.map(i => i.nome);
        } catch (error) {
            console.error("Erro ao buscar itens: ", error);
            return [];
        }
    }

    useEffect(() => {
        async function fetchMenuDetalhado() {
            if (!menuTurno || menuTurno.length === 0) {
                setMenuItensDetalhados({
                    prato_principal: [],
                    acompanhamentos: [],
                    saladas: [],
                    sobremesas: [],
                    bebidas: []
                });
                return;
            }

            const menu = menuTurno[0];

            const prato_principal = await getItensPorIds(menu.prato_principal_ids);
            const acompanhamentos = await getItensPorIds(menu.acompanhamento_ids);
            const saladas = await getItensPorIds(menu.salada_ids);
            const sobremesas = await getItensPorIds(menu.sobremesa_ids);
            const bebidas = await getItensPorIds(menu.bebida_ids);

            setMenuItensDetalhados({
                prato_principal,
                acompanhamentos,
                saladas,
                sobremesas,
                bebidas
            });
        }

        fetchMenuDetalhado();
    }, [menuTurno]);


    async function handleCreateMeal() {
        try{
            console.log(menuTurno[0].id)
            const create = await createMeal(token, menuTurno[0].id.toString(), selectedTurno);
            setMessage("Refeição Criada com Suceso")
            setShowMessage(true)
            setTimeout(() =>{
                setShowMessage(false)
            }, 2000)
            console.log(create)
        }catch(error){
            console.error(error)
            setMessage("Não foi possivel criar a refeição")
            setShowMessage(true)
            setTimeout(() =>{
                setShowMessage(false)
            }, 2000)
        }
    }

     useEffect(() => {
        if (showMessage) {
            setTimeout(() => {
                setShowMessage(false)
            }, 2000)
        } else {
            setShowMessage(false)
        }
    }, [setShowMessage])

    return (
        <>
            <div className="border-b-1 border-gray-400 mb-7 mt-110">
                <h1 className="text-2xl ml-7 mb-5 mt-5 ">Refeições</h1>
            </div>
            <div className="h-110 overflow-y-auto">

                <div className="flex flex-row gap-150">
                    <p className="ml-7">Gerenciar Refeições</p>
                    <button onClick={handleShowCreatEMeal} className="bg-black w-35 h-9 text-white rounded-xl cursor-pointer hover:bg-black/60">Nova Refeição</button>
                </div>
                <div className="border-gray-200 border-1 w-50 h-25 rounded-xl ml-7 mt-5">
                    <div className="flex flex-row gap-3 mt-4">
                        <div className="flex flex-col">
                            <p className="text-gray-400 text-[14px] ml-5 mt-2">Total Hoje</p>
                            <p className="font-bold text-black text-2xl ml-5">{historyTotalDay ? historyTotalDay : "0"}</p>
                        </div>
                        <div className="text-2xl mt-5 ml-12">📊</div>
                    </div>
                </div>

                {showCreateMeal === true && (
                    <div className="border-gray-200 border-1 w-[73%] h-65 rounded-xl ml-7 mt-5">
                        <p className="text-base mt-5 ml-5">Criar Nova Refeição</p>
                        <div className="ml-5 mt-3 flex flex-row gap-40">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Turno</label>
                                <select
                                    value={selectedTurno}
                                    onChange={(e) => setSelectedTurno(e.target.value)}
                                    className="w-75 px-3 py-2 bg-input border border-border rounded-lg bg-[#e5e5e5] text-black-200"
                                    required
                                >
                                    <option className="" value="">Selecione o turno</option>
                                    <option value="manha">Manhã</option>
                                    <option value="tarde">Tarde</option>
                                    <option value="noite">Noite</option>
                                </select>
                            </div>

                            <div className="">
                                <p className="mt-[-35px] font-medium">Informações do Cardapio Selecionado</p>
                                <div>
                                    {menuTurno && menuTurno.length > 0 ? (
                                        <div className="ml-5 mt-2">
                                            <p><strong>Prato Principal:</strong> {menuItensDetalhados.prato_principal.join(", ")}</p>
                                            <p><strong>Acompanhamentos:</strong> {menuItensDetalhados.acompanhamentos.join(", ")}</p>
                                            <p><strong>Saladas:</strong> {menuItensDetalhados.saladas.join(", ")}</p>
                                            <p><strong>Sobremesas:</strong> {menuItensDetalhados.sobremesas.join(", ")}</p>
                                            <p><strong>Bebidas:</strong> {menuItensDetalhados.bebidas.join(", ")}</p>
                                        </div>
                                    ) : (
                                        <p className="ml-5 mt-2">Nenhum cardápio disponível para este turno</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 ml-5">
                            <button onClick={handleCreateMeal} className="bg-black w-35 h-9 text-white rounded-xl cursor-pointer hover:bg-black/60">Criar Refeição</button>
                            <button onClick={handleShowCreatEMeal} className="bg-gray-100 w-25 h-9 text-black rounded-xl cursor-pointer hover:bg-black/60 ml-3">Cancelar</button>
                        </div>
                    </div>
                )}
                {historyUser ? (
                    <div className="w-170 h-min overflow-y-auto overflow-x-hidden border border-gray-300 rounded-lg ml-7 mt-10">
                        <h1 className="mt-2 mb-2 ml-4 font-semibold">Seu Histórico de Refeições</h1>
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100 sticky top-0 z-10 ">
                                <tr>
                                    <th className="p-2 text-left">Data</th>
                                    <th className="p-2 text-left">Turno</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyUser && historyUser.map((meal) => (
                                    <tr key={meal.id} className="border-t border-gray-300">
                                        <td className="p-2">{meal.date}</td>
                                        <td className="p-2">{meal.shift}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div>
                        <p>Você Não tem nenhuma refeição</p>
                    </div>
                )}


                <div className="mt-10">
                    <label className="ml-9 block text-sm font-medium text-foreground mb-2">Selecione um Data e Consulte o histórico</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-70 ml-7 px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                    />
                    <button type="submit" onClick={() => handleFindMealDay(selectedDate)} className="ml-5 bg-black w-35 h-9 text-white rounded-xl cursor-pointer hover:bg-black/60">Enviar Data</button>
                </div>

                {historyDay.length > 0 ? (
                    <div className="w-170 h-min overflow-y-auto overflow-x-hidden border border-gray-300 rounded-lg ml-7 mt-10">
                        <h1 className="mt-2 mb-2 ml-4 font-semibold">Histórico de Refeições de um Dia</h1>
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100 sticky top-0 z-10 ">
                                <tr>
                                    <th className="p-2 text-left">Data</th>
                                    <th className="p-2 text-left">Turno</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyDay && historyDay.map((mealDay) => (
                                    <tr key={mealDay.id} className="border-t border-gray-300">
                                        <td className="p-2">{mealDay.date}</td>
                                        <td className="p-2">{mealDay.shift}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="ml-7 mt-4">
                        <p>Nenhuma usuário tem refeições nessa data</p>
                    </div>
                )}

                {showMessage && (
                <div className="fixed top-3 right-5 z-50 bg-gray-400 text-white px-5 py-3 rounded-lg shadow-lg border border-gray-700 animate-slide-in">
                    {message}
                </div>
            )}
            </div>
        </>
    )
}