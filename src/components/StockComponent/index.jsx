import { useContext, useEffect, useState } from "react";
import FindAll from "../../service/service-ms-estoque/FindAll";
import { Formik, Form, Field } from "formik";
import createItem from "../../service/service-ms-estoque/CreateItem";
import updateAddAmount from "../../service/service-ms-estoque/UpdateAddAmount";
import deleteItem from "../../service/service-ms-estoque/DeleteItem";
import { AuthContext } from "../../context/AuthContext";

export default function StokeComponent() {
    const [stock, setStock] = useState([]);
    const [showAddItem, setShowAddItem] = useState(false);
    const [message, setMessage] = useState("");
    const [showmessage, setShowMessage] = useState(false);
    const {token} = useContext(AuthContext);

    const handleAddItem = () => {
        if (showAddItem === false) {
            setShowAddItem(true)
        } else {
            setShowAddItem(false);
        }
    }

    const handleAddAmount = async (itemId) => {
        try {
            const updatedItem = await updateAddAmount(token, itemId);

            setStock((prevStock) =>
                prevStock.map((item) =>
                    item.id === updatedItem.id ? updatedItem : item
                )
            );

            console.log("Item atualizado:", updatedItem);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await deleteItem(token, itemId)
            setMessage("Item deletado com Sucesso.")
            setShowMessage(true);

            setStock((prevStock) =>
                prevStock.filter((item) => item.id !== itemId)
            );
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        async function controleComponent() {
            const res = await FindAll(token);
            console.log(res)
            setStock(res);
        }
        controleComponent();
    }, [])

    useEffect(() => {
        if (showmessage) {
            setTimeout(() => {
                setShowMessage(false)
            }, 3000)
        } else {
            setShowMessage(false)
        }
    }, [showmessage])

    return (
        <div className="mt-15">
            <div className="border-b-1 border-gray-400 mb-7">
                <h1 className="text-2xl ml-7 mb-5 mt-5">Estoque</h1>
            </div>

            <div className="w-220 h-110 overflow-y-auto ml-10">
                <div className="flex flex-row items-center justify-between mb-5">
                    <h2>Gerenciar Estoque</h2>
                    <button onClick={handleAddItem} className="bg-black w-35 h-9 text-white rounded-xl hover:bg-black/60 cursor-pointer">Adicionar Item</button>
                </div>

                {showAddItem === true && (
                    <div className="border-1 border-gray-400 rounded-2xl flex flex-col p-5 mb-5">
                        <h2 className="mb-5">Novo Item</h2>

                        <Formik
                            initialValues={{
                                nomeProduto: "",
                                quantidade: "",
                                unidade: "",
                                fornecedor: ""
                            }}
                            onSubmit={async (values) => {
                                try {
                                    const item = {
                                        nome: values.nomeProduto,
                                        qntdEmEstoque: values.quantidade,
                                        unidadeDeMedida: values.unidade,
                                        fornecedor: values.fornecedor
                                    }
                                    await createItem(token, item);
                                    setMessage("Item criado com Sucesso.")
                                    setShowMessage(true);
                                    setTimeout(() => {
                                        window.location.reload()
                                    }, 2000)

                                } catch (error) {
                                    console.log(error)
                                    setMessage("Não foi possivel criar o item")
                                    setShowMessage(true);
                                    setTimeout(() => {
                                        setShowMessage(false)
                                    }, 2000)
                                }
                            }}
                        >
                            {() => (
                                <Form>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="flex flex-col">
                                            <label className="mb-1 text-sm font-medium text-gray-700">
                                                Nome do Produto
                                            </label>
                                            <Field
                                                type="text"
                                                name="nomeProduto"
                                                placeholder="Digite aqui..."
                                                className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="mb-1 text-sm font-medium text-gray-700">
                                                Quantidade
                                            </label>
                                            <Field
                                                type="number"
                                                name="quantidade"
                                                placeholder="Digite aqui..."
                                                className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="mb-1 text-sm font-medium text-gray-700">
                                                Unidade De Medida
                                            </label>
                                            <Field
                                                as="select"
                                                name="unidade"
                                                className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                                            >
                                                <option value="">Selecione</option>
                                                <option value="Kg">Quilograma (Kg)</option>
                                                <option value="g">Grama (g)</option>
                                                <option value="L">Litros (L)</option>
                                                <option value="ml">Mililitro (ml)</option>
                                                <option value="Un">Unidade (Un)</option>
                                            </Field>
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="mb-1 text-sm font-medium text-gray-700">
                                                Fornecedor
                                            </label>
                                            <Field
                                                type="text"
                                                name="fornecedor"
                                                placeholder="Digite aqui..."
                                                className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                                            />
                                        </div>
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
                                                type="button"
                                                onClick={handleAddItem}
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

                {stock && stock.length > 0 ? (
                    <div className="w-245 h-96 overflow-y-auto border border-gray-300 rounded-lg">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100 sticky top-0 z-10 ">
                                <tr>
                                    <th className="p-2 text-left">Nome</th>
                                    <th className="p-2 text-left">Quantidade</th>
                                    <th className="p-2 text-left">Unidade</th>
                                    <th className="p-2 text-left">Fornecedor</th>
                                    <th className="p-2 text-left">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stock.map((item) => (
                                    <tr key={item.id} className="border-t border-gray-300">
                                        <td className="p-2 font-semibold">{item.nome}</td>
                                        <td className="p-2">
                                            <div className="flex flex-row items-center gap-x-1">
                                                <span>{item.qntdEmEstoque}</span>
                                                <button onClick={() => handleAddAmount(item.id)} className="bg-green-500 px-2 text-white rounded hover:bg-green-300 cursor-pointer">+</button>
                                            </div>
                                        </td>
                                        <td className="p-2">{item.unidadeDeMedida}</td>
                                        <td className="p-2">{item.fornecedor}</td>
                                        <td className="p-2 space-x-2">
                                            <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-400 hover:scale-105 cursor-pointer">Deletar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <span>Você não possui itens no estoque</span>
                )}
            </div>


            {showmessage && (
                <div className="fixed top-3 right-5 z-50 bg-gray-500 text-white px-5 py-3 rounded-lg shadow-lg border border-gray-700 animate-slide-in">
                    {message}
                </div>
            )}

        </div>

    )
}