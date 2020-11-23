import React from "react";
import { BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import AccountPage from "./components/accountPage.jsx";
import Frontpage from "./components/frontpage.jsx";
import Users from "./components/users.jsx";

const App = () => {
    const loggedIn = false;
    return (
        <div>
            <Router>
                <header>
                    {loggedIn &&<Link to="/">Home</Link>}
                    {loggedIn &&<Link to="/users">Users</Link>} 
                </header>
                <div>

                    <Switch>
                        <Route exact path="/" render={() => (
                            <Frontpage loggedIn={loggedIn}/>
                        )} />
                        <Route exact path="/users" render={() => (
                            <Users />
                        )} />
                        <Route exact path="/myaccount" render={() => (
                            <AccountPage />
                        )} />
                    </Switch>
                </div>
            </Router>
        </div>
    )
};

export default App;