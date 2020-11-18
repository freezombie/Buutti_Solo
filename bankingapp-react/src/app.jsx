import React from "react";
import { BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import Frontpage from "./components/frontpage.jsx";
import Users from "./components/users.jsx";

const App = () => {
    return (
        <div>
            <Router>
                <header>
                    <Link to="/">Home</Link>
                    <Link to="/users">Users</Link> 
                </header>
                <div>
                    <Switch>
                        <Route exact path="/" render={() => (
                            <Frontpage />
                        )} />
                        <Route exact path="/users" render={() => (
                            <Users />
                        )} />
                    </Switch>
                </div>
            </Router>
        </div>
    )
};

export default App;