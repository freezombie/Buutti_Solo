import React from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import AccountPage from "./components/accountPage.jsx";
import Frontpage from "./components/frontpage.jsx";
import Navbar from "./components/navbar.jsx";
import "antd/dist/antd.css";
import { Layout } from 'antd';
import "./app.css";
// emailin piilottamista varten roboteilta. totta puhuen ei näytä edes kovin turvalliselta 
// (luulis että joku botti tajuaa invertata takasin), mutta it is what it is
// https://www.npmjs.com/package/react-obfuscate
import Obfuscate from "react-obfuscate";

const { Header, Footer, Content } = Layout;

const App = () => {
    return (
        <Layout style={{minHeight: "100vh"}}>
            <Router>
                <Header>
                     <Navbar />
                </Header>
                <Content>
                    <Switch>
                        <Route exact path="/" render={() => (
                            <Frontpage />
                        )} />
                        <Route exact path="/myaccount" render={() => (
                            <AccountPage />
                        )} />
                    </Switch>
                </Content>
            </Router>
            <Footer>
                <p>Made by Antti Pikkuaho. Contact: <i><Obfuscate email="antti.pikkuaho@outlook.com" /></i></p>
            </Footer>
        </Layout>
    )
};

export default App;