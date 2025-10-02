import { createContext, useState, useEffect, useRef } from "react";
import login from "../service/ms-authentication/Login";
import logout from "../service/ms-authentication/Logout";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [logoutTimeout, setLogoutTimeout] = useState(null);
    const timeoutIdRef = useRef(null);

    useEffect(() => {
        
        const savedToken = localStorage.getItem("token");
        const expiration = localStorage.getItem("tokenExpiration");

        if (savedToken && expiration) {
            const now = new Date().getTime();
            const expiresAt = new Date(expiration).getTime();
            const timeUntilExpiration = expiresAt - now;


            if (timeUntilExpiration > 0) {
                setToken(savedToken);
                scheduleLogout(savedToken, timeUntilExpiration);
            } else {
                cleanupAuth();
            }
        }
    }, []);

    const scheduleLogout = (currentToken, timeout) => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }

        if (timeout <= 0) {
            return;
        }

        if (timeout > 2147483647) {
            timeout = 2147483647;
        }

        timeoutIdRef.current = setTimeout(() => {
            logoutContext(currentToken);
        }, timeout);

        setLogoutTimeout(timeoutIdRef.current);
    };

    const cleanupAuth = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }
        
        setToken(null);
    };

    async function loginContext(email, password) {
        try {
            const result = await login(email, password);

            const { token, expire_at } = result;
            
            localStorage.setItem("token", token);
            localStorage.setItem("tokenExpiration", expire_at);

            const expirationTime = new Date(expire_at).getTime();
            const now = new Date().getTime();
            const timeUntilExpiration = expirationTime - now;

            if (timeUntilExpiration <= 0) {
                cleanupAuth();
                return { success: false, error: "Token expirado" };
            }

            setToken(token);

            scheduleLogout(token, timeUntilExpiration);

            return { success: true };

        } catch (error) {
            console.error("Erro no login:", error);
            return { success: false, error: error.message };
        }
    }

    async function logoutContext(tokenToUse = null) {
        
        const tokenToSend = tokenToUse || token;
        
        cleanupAuth();

        try {
            if (tokenToSend) {
                await logout(tokenToSend);
            }
        } catch (err) {
            console.error("Erro no logout do servidor:", err.message);
        }
    }

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, loginContext, logoutContext, token }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };