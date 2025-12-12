import { createContext, useState, useEffect, useCallback, useRef } from 'react';
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

function ToastComponent({ id, text, remove, pouse, set_pouse }){
    const [isVisible, setIsVisible] = useState(true);
    
    useEffect(
        ()=>{
            if(!pouse){
                const timerId = setTimeout(()=>{
                    setIsVisible(false);
                    // アニメーション時間（0.3s）後にDOMから削除
                    setTimeout(() => {
                        remove(id);
                    }, 300);
                },5000);
                return (
                    ()=>{
                        clearTimeout(timerId)
                    }
                )
            }
        }
        ,[pouse]
    )

    function focusOn(){
        console.log("focus!!")
        set_pouse(true);
    }

    function focusOff(){
        set_pouse(false);
    }

    const className = `toast ${isVisible ? "" : "hiding"}`;

    return(
        <div 
            className={className}
            tabIndex="0"
            onMouseEnter={focusOn}
            onMouseLeave={focusOff}
            onFocus={focusOn}
            onBlur={focusOff}
        >
            {text}
        </div>
    );
}

function AppProvider(){
    const [isLogin, setIsLogin] = useState(false);
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(true);
    const [toastList, setToastList] = useState([])
    const [idCount, setIdCount] = useState(0);
    const [isPouse, setIsPouse] = useState(false);

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
        const buffer_list = toastList.concat();
        buffer_list.push({id: idCount, text: text});
        setIdCount(idCount+1);
        setToastList(
            (prevToastList)=>{
                return [...prevToastList, {id: idCount, text: text}];
            }
        );
    }

    const removeToast = 
        useCallback((id)=>{
            setToastList(
                (prevToastList) => {
                    const buffer_list = prevToastList.concat();
                    const updated_list = buffer_list.filter((toast)=>{return toast.id != id;})
                    return updated_list;
                }
            );
        },[]);

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
                    <div className="toast_list">
                        {toastList.map((toastItem)=>{
                            return(
                                <div key={toastItem.id}>
                                    <ToastComponent
                                        id={toastItem.id}
                                        text={toastItem.text}
                                        remove={removeToast}
                                        pouse={isPouse}
                                        set_pouse={setIsPouse}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </ToastContext.Provider>
            </AuthContext.Provider>
        );
    }
};

export { AppProvider };
export { AuthContext };
export { ToastContext };