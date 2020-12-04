import axios from "axios";
import React, { Component } from "react";

const accountAxios = axios.create();
const AppContext = React.createContext();
const URL = "http://localhost:5000";

accountAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export class AppContextProvider extends Component {
    constructor() {
        super()
        this.state = {
            user: JSON.parse(localStorage.getItem("user")) || {},
            token: localStorage.getItem("token") || "",
            balance: 0
        }
    }

    componentDidMount() {
        this.getBalance();
    }
    // userinfoon tulee ne infot mitä signup tarvii.
    signup = (userInfo) => {
        console.log(userInfo);
        return accountAxios({
            method: "post",
            url: `${URL}/auth/new`,
            headers: { "Content-Type": "application/json"},
            data: {
                name: userInfo.name,
                password: userInfo.password,
                deposit: userInfo.deposit
            }
        })
            .then(response => {
                const { user, token } = response.data
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                this.setState({
                    user,
                    token
                });
                return response;
            }, (error) => {
                console.log(error);
            })
    }

    login = (userInfo) => {
        return accountAxios({
            method: "post",
            url: `${URL}/auth/login`,
            headers: { "Content-Type": "application/json"},
            data: {
                id: userInfo.id,
                password: userInfo.password
            }
        })
            .then(response => {
                const { user, token } = response.data
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user));
                this.setState({
                    user,
                    token
                });
                console.log("Login function ran succesfully");
                return response;
            }, (error) => {
                console.log(error);
            })
    }

    logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        this.setState({
            user: {},
            token: ""
        })
    }

    getBalance = () => {
        return accountAxios({
            method: "get",
            url: `${URL}/api/accounts`,
        }).then(response => {
                this.setState({ balance: response.data });
                console.log(response);
                if(response.status === 200) {
                    return response.data.account_balance;
                }
            })
    }

    render() {
        return (
            <AppContext.Provider
                value={{
                    signup: this.signup,
                    login: this.login,
                    logout: this.logout,
                    getBalance: this.getBalance,
                    ...this.state
                }}
            >
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export const withContext = Component => {
    return props => {
        return (
            <AppContext.Consumer>
                {
                    globalState => {
                        return (
                            <Component
                                {...globalState}
                                {...props}
                            />
                        )
                    }
                }
            </AppContext.Consumer>
        )
    }
}