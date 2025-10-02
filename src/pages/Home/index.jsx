import { useContext, useState } from "react";
import LoginModule from "../../components/LoginComponent";
import RegisterModule from "../../components/RegisterComponent";
import { AuthContext } from "../../context/AuthContext";
import StokeComponent from "../../components/StockComponent";
import MealComponent from "../../components/MealComponent";
import MenuComponent from "../../components/MenuComponent";
import { FaBoxOpen, FaUtensils, FaClipboard } from "react-icons/fa";

export default function Home() {
    const { isAuthenticated, token, logoutContext } = useContext(AuthContext);
    const [authShow, setAuthShow] = useState("Login");
    const [activeButton, setActiveButton] = useState(1);

    const handleAuthComponent = () => {
        if (authShow === "Login") {
            setAuthShow("Register")
        } else {
            setAuthShow("Login")
        }
    }
    const handleClickButton = (id) => {
        setActiveButton(id)
    }

    if (!isAuthenticated) {
        console.log(isAuthenticated)
        return authShow === "Login" ? (
            <div className="flex flex-col bg-gray-100 items-center justify-center ">
                <LoginModule />

                <button
                    onClick={handleAuthComponent}
                    className="text-base text-black hover:underline -mt-13"
                >
                    Não tem conta? Cadastre-se
                </button>
            </div>
        ) : (

            <div className="flex flex-col bg-gray-100 items-center justify-center ">
                <RegisterModule />
                <button className="text-base text-black hover:underline -mt-12" onClick={handleAuthComponent}>
                    Já tem conta? Entre
                </button>
            </div>
        )
    }

    return (
        <>
            {console.log(isAuthenticated)}
            <div className="flex items-center justify-between flex-row">
                <div className="w-70 border-r-1 border-gray-400">
                    <h1 className="text-xl p-5 font-bold border-b-1 border-gray-400">Sistema De Gestão De Restaurante</h1>
                    <nav className="fixed w-70 flex flex-col items-start p-4 gap-4 h-full  border-gray-400 border-r-1">

                        <button onClick={() => handleClickButton(1)} className={`flex w-60 text-2xl items-center gap-2  px-4 py-2 rounded  cursor-pointer hover:scale-105${activeButton === 1 ? (
                            " bg-gray-800 text-white"
                        ) : (
                            " bg-white text-gray-500"
                        )}`}>
                            <FaBoxOpen />
                            <span>Estoque</span>
                        </button>
                        <button onClick={() => handleClickButton(2)} className={`flex w-60 text-2xl items-center gap-2  px-4 py-2 rounded cursor-pointer hover:scale-105${activeButton === 2 ? (
                            " bg-gray-800 text-white"
                        ) : (
                            " bg-white text-gray-500"
                        )}`}>
                            <FaUtensils />
                            <span>Refeições</span>
                        </button>
                        <button onClick={() => handleClickButton(3)} className={`flex w-60 text-2xl items-center gap-2  px-4 py-2 rounded cursor-pointer hover:scale-105${activeButton === 3 ? (
                            " bg-gray-800 text-white"
                        ) : (
                            " bg-white text-gray-500"
                        )}`}>
                            <FaClipboard />
                            <span>Cardápios</span>
                        </button>
                        <button
                            className="bg-black w-60 mt-50 text-white px-5 py-2 rounded-lg shadow-md 
                                            hover:bg-black/70 hover:shadow-lg 
                                            focus:outline-none focus:ring-2 focus:ring-gray-400
                                            transition-all duration-300"
                            onClick={() => logoutContext()}
                        >
                            Sair
                        </button>

                    </nav>
                </div>

                {activeButton === 1 && (
                    <div className="fixed w-full mt-100 left-70">
                        <StokeComponent />
                    </div>
                )}

                {activeButton === 2 && (
                    <div className="fixed w-full mt-8 left-70">
                        <MealComponent />
                    </div>
                )}

                {activeButton === 3 && (
                    <div className="fixed w-full mt-8 left-70">
                        <MenuComponent />
                    </div>
                )}

            </div>
        </>
    )
}