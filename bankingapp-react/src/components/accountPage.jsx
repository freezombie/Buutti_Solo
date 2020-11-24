import { withContext } from "./AppContext";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from  "react";
import axios from "axios";

function AccountPage(props) {
    const [accountBalance, setAccountBalance] = useState({});
    const history = useHistory();

    useEffect(() => {
        /*return axios({
            method: "get",
            url: `${URL}/api/accounts`,
            headers: { "Content-Type": "application/json"},
            data: {
                id: userInfo.id,
                password: userInfo.password
            }
        });*/
    }, []);

    if(!props.token){
        history.push("/");
    }
return (
    <div>
        <p>Welcome {props.user.name}! You are on your account page.</p>
        <p>Your ID is: {props.user.id}. Please keep it safe as it is needed for login.</p>
    </div>
)
}

export default withContext(AccountPage);