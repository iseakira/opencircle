import { createContext, useState, useEffect } from 'react';
import AppRouter from './AppRouter';

const AuthContext = createContext({
    getLogin: () => {},
    setLogin: () => {},
    setLogout: () => {},
});

function AuthProvider(){
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    async function session_check(){
        /*
        try{
            const response = await fetch(
                "http://localhost:5001/api/check_login",
                {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                }
            )
            if(response.ok){
                const login_json = await response.json();
                if(login_json == "true"){
                    setIsLogin(true);
                }else{
                    setIsLogin(false);
                }
            }
        }catch{
            console.log("エラー")
        }
            */
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

    console.log("動作確認:loading=")

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

//value={{getLogin, setLogin, setLogout}}
export { AuthProvider };
export { AuthContext };