import React, { Component } from 'react';
import Cookies from "js-cookie";
import Data from "./Data";

const Context = React.createContext();

export class Provider extends Component {
    state = {
        authenticatedUser: Cookies.getJSON("authenticatedUser") || null,
    }

    constructor(){
        super();
        //this.data retrieves methods from data.js
        this.data = new Data();
    }

    render(){
        const {authenticatedUser} = this.state;
        const value = {
            authenticatedUser,
            data: this.data,
            actions: {
                signIn: this.signIn,
                signOut: this.signOut,
            }
        }

        return (
            //Components will be nested in Context.Provider so that component can access data without countless props being passed down
            <Context.Provider value={value}>
                {this.props.children}
            </Context.Provider>
        );
    }

    //Method used to sign in users that can be accessed in the actions object that is nested in the value variable
    signIn = async (emailAddress, password) => {
        const user = await this.data.getUser(emailAddress, password);
        if(user !== null){
            user.password = password;
            this.setState(()=>{
                return {
                    authenticatedUser: user,
                };
            });
        //Sets authenticated user in cookies for 24 hours
        Cookies.set("authenticatedUser", JSON.stringify(user), {expires: 1});
        }
        return user;
    } 
    //Simple method that signs out user and removes them from cookies in browser
    signOut = () => {
        this.setState(()=>{
            return {
                authenticatedUser: null,
            };
        });
        Cookies.remove("authenticatedUser");
    }
} 

export const Consumer = Context.Consumer;

//withContext is imported into App.js so components can be nested within it
export default function withContext(Component) {
    return function ContextComponent(props) {
        return (
            <Context.Consumer>
                {context => <Component {...props} context={context} />}
            </Context.Consumer>
        );
    }
}
