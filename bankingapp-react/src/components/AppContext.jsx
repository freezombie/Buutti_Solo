import axios from "axios";
import React, { Component } from "react";

const AppContext = React.createContext();

const URL = "http://localhost:5000";

export class AppContextProvider extends Component {
    constructor() {
        super()
        this.state = {
            user: JSON.parse(localStorage.getItem("user")) || {},
            token: localStorage.getItem("token") || ""
        }
    }
    // userinfoon tulee ne infot mitä signup tarvii.
    signup = (userInfo) => {
        return axios({
            method: "post",
            url: `${URL}/auth/new`,
            headers: { "Content-Type": "application/json"},
            data: {
                name: userInfo.name,
                password: userInfo.password
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
        return axios({
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

    render() {
        return (
            <AppContext.Provider
                value={{
                    signup: this.signup,
                    login: this.login,
                    logout: this.logout,
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