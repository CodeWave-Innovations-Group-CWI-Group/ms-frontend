import { Formik, Form, Field, FieldArray } from "formik";
import { useContext, useEffect, useState } from "react";
import FindAll from "../../service/service-ms-estoque/FindAll.js";
import listMenu from "../../service/service-ms-cardapio/ListMenus.js";
import createMenu from "../../service/service-ms-cardapio/CreateMenu.js";
import findItemListById from "../../service/service-ms-estoque/FindItemsListById.js";
import deleteMenu from "../../service/service-ms-cardapio/DeleteMenu.js";
import updateSubAmount from "../../service/service-ms-estoque/UpdateSubAmount.js";
import { AuthContext } from "../../context/AuthContext";

export default function MenuComponent() {
    const [findStock, setFindStock] = useState([]);
    const [findMenu, setFindMenu] = useState([]);
    const [menuItensDetalhados, setMenuItensDetalhados] = useState([]);
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState("");
    const [openMeal, setOpenMeal] = useState(false);
    const {token} = useContext(AuthContext)


    useEffect(() => {
        async function controleComponent() {
            const res = await FindAll(token);
            setFindStock(res);
            console.log("estoque ", res);
        }
        controleComponent();
    }, []);

    useEffect(() => {
        async function findMenus() {
            try {
                const menus = await listMenu(token);
                setFindMenu(menus);
                console.log(menus, "aqui")
            } catch (error) {
                console.error("Erro ao buscar cardápios:", error);
                setFindMenu([]);
            }
        }
        findMenus();
    }, []);

    useEffect(() => {
        async function buscarItens() {
            const todosMenusDetalhados = [];

            for (const menu of findMenu) {
                const categorias = {
                    prato_principal: menu.prato_principal_ids,
                    acompanhamentos: menu.acompanhamento_ids,
                    saladas: menu.salada_ids,
                    sobremesas: menu.sobremesa_ids,
                    bebidas: menu.bebida_ids,
                };

                const detalhesMenu = { menuId: menu.id };

                for (const [categoria, ids] of Object.entries(categorias)) {
                    if (ids && ids.length > 0) {
                        try {
                            const res = await findItemListById(token, ids);
                            detalhesMenu[categoria] = res;
                        } catch (err) {
                            console.error(`Erro ao buscar ${categoria}:`, err);
                            detalhesMenu[categoria] = [];
                        }
                    } else {
                        detalhesMenu[categoria] = [];
                    }
                }

                todosMenusDetalhados.push(detalhesMenu);
            }

            setMenuItensDetalhados(todosMenusDetalhados);
        }

        if (findMenu.length > 0) {
            buscarItens();
        }
    }, [findMenu]);


    async function handleDelete(menuId) {
        await deleteMenu(token, menuId)
        setMessage("Cardápio Deletado");
        setShowMessage(true);
        setTimeout(() => {
            window.location.reload();
        }, 2000)
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

    function handleOpenMenu() {
        if (openMeal) {
            setOpenMeal(false)
        } else {
            setOpenMeal(true)
        }
    }

    return (
        <>
            <div className="border-b-1 border-gray-400 mb-7 mt-108">
                <h1 className="text-2xl ml-7 mb-5 mt-5 ">Cardápios</h1>
            </div>
            <div className="w-220 h-110 ml-7 overflow-y-auto">
                <div className="flex flex-row justify-between mb-5">
                    <p className="">Gerenciar Cardápios</p>
                    <button onClick={handleOpenMenu} className="bg-black w-35 h-9 text-white rounded-xl cursor-pointer hover:bg-black/60">
                        Novo Cardápio
                    </button>
                </div>

                {openMeal && (
                    <div className="border-1 border-gray-400 rounded-2xl flex flex-col p-5 mb-5">
                        <h2 className="mb-5">Novo Item</h2>

                        <Formik
                            initialValues={{
                                data: "",
                                turno: "",
                                pratoPrincipal: [""],
                                acompanhamentos: [""],
                                saladas: [""],
                                sobremesas: [""],
                                bebidas: [""],
                            }}
                            onSubmit={async (values, { resetForm }) => {
                                const payload = {
                                    data: values.data,
                                    turno: values.turno,
                                    prato_principal_ids: values.pratoPrincipal.filter(v => v),
                                    acompanhamento_ids: values.acompanhamentos.filter(v => v),
                                    salada_ids: values.saladas.filter(v => v),
                                    sobremesa_ids: values.sobremesas.filter(v => v),
                                    bebida_ids: values.bebidas.filter(v => v),
                                };
                                console.log("Enviando payload: ", values);
                                try {
                                    const resultado = await createMenu(token,payload);
                                    if (payload.prato_principal_ids.length > 0) {
                                        for (const id of payload.prato_principal_ids) {
                                            await updateSubAmount(token, id);
                                        }
                                    }
                                    if (payload.acompanhamento_ids.length > 0) {
                                        for (const id of payload.acompanhamento_ids) {
                                            await updateSubAmount(token,id);
                                        }
                                    }
                                    if (payload.salada_ids.length > 0) {
                                        for (const id of payload.salada_ids) {
                                            await updateSubAmount(token,id);
                                        }
                                    }
                                    if (payload.sobremesa_ids.length > 0) {
                                        for (const id of payload.sobremesa_ids) {
                                            await updateSubAmount(token,id);
                                        }
                                    }
                                    if (payload.bebida_ids.length > 0) {
                                        for (const id of payload.bebida_ids) {
                                            await updateSubAmount(token,id);
                                        }
                                    }

                                    setMessage("Cardápio Criado com Sucesso");
                                    setShowMessage(true)
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 3000)
                                    console.log("Criação do Cardapio: ", resultado);
                                    resetForm();
                                } catch (error) {
                                    console.error(error);
                                    setMessage("Não foi possivél criar o cardápio");
                                    setShowMessage(true);
                                    setTimeout(() => {
                                        setShowMessage(false)
                                    }, 2000)
                                }
                            }}
                        >
                            {({ values }) => (
                                <Form>
                                    <div className="grid grid-cols-2">
                                        <div>
                                            <label className="ml-9 block text-sm font-medium text-foreground mb-2">
                                                Data
                                            </label>
                                            <Field
                                                type="date"
                                                name="data"
                                                className="w-70 ml-7 px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Turno
                                            </label>
                                            <Field
                                                as="select"
                                                name="turno"
                                                className="w-75 px-3 py-2 bg-input border border-border rounded-lg bg-[#e5e5e5] text-black-200"
                                                required
                                            >
                                                <option value="">Selecione o turno</option>
                                                <option value="manha">Manhã</option>
                                                <option value="tarde">Tarde</option>
                                                <option value="noite">Noite</option>
                                            </Field>
                                        </div>
                                        <FieldArray name="pratoPrincipal">
                                            {({ push, remove }) => (
                                                <div className="mt-2">
                                                    <label className="ml-9 block text-sm font-medium text-foreground mb-2">
                                                        Prato Principal
                                                    </label>
                                                    {values.pratoPrincipal.map((_, index) => (
                                                        <div key={index} className="flex items-center ml-7 mb-2">
                                                            <Field
                                                                as="select"
                                                                name={`pratoPrincipal.${index}`}
                                                                className="w-75 px-3 py-2 bg-input border border-border rounded-lg bg-[#e5e5e5]"
                                                                required
                                                            >
                                                                <option value="">Selecione o Prato Principal</option>
                                                                {findStock.map((item) => (
                                                                    item.qntdEmEstoque > 0 && (
                                                                        <option key={item.id} value={item.id}>
                                                                            {item.nome}
                                                                        </option>
                                                                    )))}
                                                            </Field>
                                                            <button
                                                                type="button"
                                                                onClick={() => push("")}
                                                                className="ml-3 bg-green-500 px-2 text-white rounded hover:bg-green-300 cursor-pointer w-8 h-8"
                                                            >
                                                                +
                                                            </button>
                                                            {index > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => remove(index)}
                                                                    className="ml-2 bg-red-500 px-2 text-white rounded hover:bg-red-300 cursor-pointer w-8 h-8"
                                                                >
                                                                    -
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </FieldArray>
                                        {["acompanhamentos", "saladas", "sobremesas", "bebidas"].map(
                                            (fieldName) => (
                                                <FieldArray name={fieldName} key={fieldName}>
                                                    {({ push, remove }) => (
                                                        <div className="mt-2">
                                                            <label className="ml-9 block text-sm font-medium text-foreground mb-2">
                                                                {fieldName.charAt(0).toUpperCase() +
                                                                    fieldName.slice(1)}
                                                            </label>
                                                            {values[fieldName].map((_, index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`flex items-center ${fieldName !== "acompanhamentos" ? "ml-7" : ""
                                                                        } mb-2`}
                                                                >
                                                                    <Field
                                                                        as="select"
                                                                        name={`${fieldName}.${index}`}
                                                                        className="w-75 px-3 py-2 bg-input border border-border rounded-lg bg-[#e5e5e5]"
                                                                        required
                                                                    >
                                                                        <option value="">
                                                                            Selecione {fieldName.slice(0, -1)}
                                                                        </option>
                                                                        {findStock.map((item) => (
                                                                            <option key={item.id} value={item.id}>
                                                                                {item.nome}
                                                                            </option>
                                                                        ))}
                                                                    </Field>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => push("")}
                                                                        className="ml-3 bg-green-500 px-2 text-white rounded hover:bg-green-300 cursor-pointer w-8 h-8"
                                                                    >
                                                                        +
                                                                    </button>
                                                                    {index > 0 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => remove(index)}
                                                                            className="ml-2 bg-red-500 px-2 text-white rounded hover:bg-red-300 cursor-pointer w-8 h-8"
                                                                        >
                                                                            -
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </FieldArray>
                                            )
                                        )}
                                    </div>

                                    <div className="flex flex-row mt-5">
                                        <div className="mt-4 ml-5">
                                            <button
                                                type="submit"
                                                className="bg-black w-35 h-9 text-white rounded-xl cursor-pointer hover:bg-black/60"
                                            >
                                                Salvar
                                            </button>
                                            <button
                                                onClick={handleOpenMenu}
                                                type="reset"
                                                className="bg-gray-100 w-25 h-9 text-black rounded-xl cursor-pointer hover:bg-black/60 ml-3"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                )}
                {findMenu.length > 0 && (
                    <div className="w-200 h-min overflow-y-auto overflow-x-hidden border border-gray-300 rounded-lg ml-7 mt-10">
                        <h1 className="mt-2 mb-2 ml-4 font-semibold">
                            Cardápios
                        </h1>
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100 sticky top-0 z-10 ">
                                <tr>
                                    <th className="p-2 text-left">Data</th>
                                    <th className="p-2 text-left">Turno</th>
                                    <th className="p-2 text-left">Prato Principal</th>
                                    <th className="p-2 text-left">Acompanhamento</th>
                                    <th className="p-2 text-left">Saladas</th>
                                    <th className="p-2 text-left">Sobremesa</th>
                                    <th className="p-2 text-left">Bebida</th>
                                    <th className="p-2 text-left">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {findMenu.map((menu) => {
                                    const getNomesPorCategoria = (menu, categoria) =>
                                        (menuItensDetalhados.find(m => m.menuId === menu.id)?.[categoria] || []).map(i => i.nome);

                                    const pratosPrincipais = getNomesPorCategoria(menu, "prato_principal");
                                    const acompanhamentos = getNomesPorCategoria(menu, "acompanhamentos");
                                    const saladas = getNomesPorCategoria(menu, "saladas");
                                    const sobremesas = getNomesPorCategoria(menu, "sobremesas");
                                    const bebidas = getNomesPorCategoria(menu, "bebidas");


                                    return (
                                        <tr key={menu.id} className="border-t border-gray-300">
                                            <td className="p-2">{menu.data}</td>
                                            <td className="p-2">{menu.turno}</td>
                                            <td className="p-2">{pratosPrincipais.join(", ")}</td>
                                            <td className="p-2">{acompanhamentos.join(", ")}</td>
                                            <td className="p-2">{saladas.join(", ")}</td>
                                            <td className="p-2">{sobremesas.join(", ")}</td>
                                            <td className="p-2">{bebidas.join(", ")}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDelete(menu.id)}
                                                        className="text-destructive hover:text-destructive/80 text-red-500"
                                                    >
                                                        Deletar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showMessage && (
                <div className="fixed top-3 right-5 z-50 bg-gray-400 text-white px-5 py-3 rounded-lg shadow-lg border border-gray-700 animate-slide-in">
                    {message}
                </div>
            )}
        </>
    );
}
