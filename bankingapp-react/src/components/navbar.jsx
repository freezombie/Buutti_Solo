import { withContext } from "./AppContext";
import React, { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

function Navbar(props) {

    const goToFrontPage = () => {
        window.location = "/";
    }

    return (
        <div>
            <Link to="/" onClick = { goToFrontPage }>Home</Link>
            {props.token && <Link to="/myaccount">My Account</Link>}
            {props.token && <Link to="/" onClick = { props.logout }>Logout</Link>}            
        </div>
    );
}

export default withContext(Navbar);