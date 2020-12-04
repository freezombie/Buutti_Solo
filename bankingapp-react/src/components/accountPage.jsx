import { withContext } from "./AppContext";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from  "react";
import axios from "axios";

function AccountPage(props) {
    const [accountBalance, setAccountBalance] = useState(0);
    const history = useHistory();

    useEffect(() => {
        const getBalance = async () => {
        const newBalance = await props.getBalance()
        setAccountBalance(newBalance);    
        }
        getBalance();

    }, []);

    if(!props.token){
        history.push("/");
    }
return (
    <div>
        <p>Welcome {props.user.name}! You are on your account page.</p>
        <p>Your ID is: {props.user.id}. Please keep it safe as it is needed for login.</p>
        <p>Your current balance is: {accountBalance}</p>
    </div>
    )
}

export default withContext(AccountPage);