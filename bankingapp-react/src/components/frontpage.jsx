import "./frontpage.css";
import { Button } from 'antd';
import "antd/dist/antd.css";
import { useState } from 'react';
import Signup from "./signup.jsx";
import Login from "./login.jsx";

function Frontpage(props) {
    const [onFrontpage, setOnFrontpage] = useState(true);
    const [onLoginPage, setOnLoginPage] = useState(false);
    const [onSignupPage, setOnSignupPage] = useState(false);

    const activateLogin = () => {
        console.log("going to login");
        setOnFrontpage(false);
        setOnLoginPage(true);
    }
    
    const activateSignup = () => {
        console.log("going to signup");
        setOnFrontpage(false);
        setOnSignupPage(true);
    }

    if(onFrontpage)
    {
        return (
        <div id="frontPage">
            <div id="frontPageLogo">
                <img src="/graphic/frontpage.png" alt="frontpage logo" />
                <Button className="leftLink" type="text" onClick={activateLogin}>Login</Button>
                <Button className="rightLink" type="text" onClick={activateSignup}>Signup</Button>
            </div>
        </div>
        );
    } else if (onLoginPage) {
        return (
            <div id="frontPage">
                <Login />
            </div>
        );
    } else if (onSignupPage) {
        return (
            <div id="frontPage">
                <Signup />
            </div>
        );
    }
}

export default Frontpage;

