import { createContext, useState, useEffect } from 'react';
import AppRouter from './AppRouter';
import './css/Toast.css';

const ToastContext = createContext({
    setToast: () => {}
})

const AuthContext = createContext({
    getLogin: () => {},
    setLogin: () => {},
    setLogout: () => {},
    getUserName: () => {},
    setUserName: () => {},
});

function ErrorToText(receive){
    let text = "";
    switch(receive){
        case "User_Duplication":
            text = text + "既に使われているメールアドレスです。";
            break;
        case "Database_Time_Out":
            text = text + "処理が込み合っています。時間を空けて再度送信してください。";
            break;
        case "No_Tmp_Account":
            text = text + "セッション情報がありません。再度メールアドレスの入力からやり直してください。";
            break;
        case "Exceed_Attempt_Count":
            text = text + "認証コードの入力回数が一定回数を越えています。再度メールアドレスの入力からやり直してください。";
            break;
        case "Expired_Tmp_Account":
            text = text + "認証コードの期限が切れています。再度メールアドレスの入力からやり直してください";
            break;
        case "Wrong_Auth_Code":
            text = text + "認証コードが間違っています。もう一度入力してください。";
            break;
        case "Wrong_Password":
            text = text + "メールアドレスかパスワードが間違っています。";
            break;
        default:
            text = text + receive;
    }
    /*
    コピペ用
        case "":
            text = text + "";
            break;
    */
    return text;
}

function ToastComponent({ text }){
    if(text == ""){
        return (
            <></>
        );
    }else{
        return (
            <>
                <div className="toast">
                    {text}
                </div>
            </>
        )
    }
}

function AppProvider(){
    const [isLogin, setIsLogin] = useState(false);
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(true);
    const [toastText, setToastText] = useState("")

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
                console.log("かえってきたやつ");
                console.log(login_obj);
                if(login_obj.is_login){
                    setIsLogin(true);
                    setName(login_obj.user_name);
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

    function getUserName(){
        return name;
    }
    
    function setUserName(new_user_name){
        setName(new_user_name);
    }
    
    function setToast(receive){
        const text = ErrorToText(receive);
        setToastText(text);
        setTimeout(
            () => {setToastText("");},
            5000
        );
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
            <AuthContext.Provider value={{getLogin, setLogin, setLogout, getUserName, setUserName}}>
                <ToastContext.Provider value={{setToast}}>
                    <AppRouter />
                    <ToastComponent text={toastText}/>
                </ToastContext.Provider>
            </AuthContext.Provider>
        );
    }
};

export { AppProvider };
export { AuthContext };
export { ToastContext };

//ここからいったんトーストを書く
//トースト実装->ContextのProviderを統一(多分)->名前を合わせる
/*
トーストでやらなきゃいけない処理
・文字列を受け取る -> exportするのは文字列を受け取る関数
・html要素をreturnする
・時間経過で消す(setTimer(JavaScript標準機能)(visible=false)
*/