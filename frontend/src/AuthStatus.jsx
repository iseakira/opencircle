import { createContext, useState, useEffect } from 'react';
import AppRouter from './AppRouter';

const AuthContext = createContext({
    getLogin: () => {},
    setLogin: () => {},
    setLogout: () => {},
    getUserName: () => {},
    setUserName: () => {},
});

function AuthProvider(){
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    async function session_check(){
        try{
            const response = await fetch(
                "http://localhost:5001/api/check_login",
                {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    credentials: "include"
                }
            )
            if(response.ok){
                const login_obj = await response.json();
                console.log("かえってきたやつは " + login_obj.isLogin)
                if(login_obj.isLogin){
                    setIsLogin(true);
                }else{
                    console.log("ログインしてない")
                    setIsLogin(false);
                }
            }
        }catch{
            console.log("エラー")
        }
        setLoading(false);

        console.log("初回確認");
    };

    useEffect(
        () => {
            session_check()
        },[]
    )

    function getLogin(){
        return isLogin;
    }

    function setLogin(){
        setIsLogin(true);
    }

    function setLogout(){
        setIsLogin(false);
    }

    console.log("isLogin = " + isLogin)

    if(loading){
        return(
            <div>
                loading
            </div>
        );
    }else{
        return(
            <AuthContext.Provider value={{getLogin, setLogin, setLogout}}>
                <AppRouter />
            </AuthContext.Provider>
        );
    }
};

export { AuthProvider };
export { AuthContext };