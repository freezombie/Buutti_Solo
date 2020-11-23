import { withContext } from "./AppContext";
import { useHistory } from "react-router-dom";

function AccountPage(props) {
    const history = useHistory();
    console.log(props.user);
    if(!props.user.hasOwnProperty("name")){
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