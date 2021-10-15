import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class UserSignUp extends Component {
    state = {
        firstName: '',
        lastName: '',
        emailAddress: '',
        password: '',
        errors: [],
    }

    render() {
        //What user types into input boxes becomes is set to the corresponding state key using this.change 
        const {
            firstName,
            lastName,
            emailAddress,
            password,
            errors,
        } = this.state;

        return (
            <div className="form--centered">
                <h2>Sign Up</h2>
                <Form 
                    cancel={this.cancel}
                    errors={errors}
                    submit={this.submit}
                    submitButtonText="Sign Up"
                    elements={() => (
                        <React.Fragment>
                            <label htmlFor="firstName">First Name</label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                onChange={this.change} 
                                placeholder={firstName}/>
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                id="lastName" 
                                name="lastName" 
                                type="text" 
                                onChange={this.change} 
                                placeholder={lastName}/>
                            <label htmlFor="emailAddress">Email Address</label>
                            <input 
                                id="emailAddress" 
                                name="emailAddress" 
                                type="email"
                                onChange={this.change} 
                                placeholder={emailAddress}/>
                            <label htmlFor="password">Password</label>
                            <input 
                                id="password" 
                                name="password"
                                type="password"
                                onChange={this.change} 
                                placeholder={password} />                
                        </React.Fragment>
                )} />
                <p>
                    Already have a user account? <Link to="/signin">Click here</Link> to sign in!
                </p>
            </div>
            );
    }

    //simple method to modify state value based on what is typed in input/textarea elements
    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(() => {
            return {
                [name]: value
            };
        });
    }

    //Submit method takes required keys from state and sends the values to api 
    submit = () => {
        const {context} = this.props;

        const {
            firstName,
            lastName,
            emailAddress,
            password,
            errors
        } = this.state;

        //Variable that contains values from keys in state of this component that will be sent to api
        const user = {
            firstName,
            lastName,
            emailAddress,
            password,
            errors
        };

        //createUser method takes credentials from context api and course variable to execute request 
        if(emailAddress === "" && (password.length < 8 || password.length > 20) || emailAddress === " " && (password.length< 8 || password.length > 20)){
            this.setState({errors: [...errors, "A valid email address is required", "password must be 8-20 characters"]})
        } else if (emailAddress === "" || emailAddress === " "){
            this.setState({errors: [...errors, "A valid email address is required"]})
        } else if (password.length < 8 || password.length > 20){
            this.setState({errors: [...errors, "A valid email address is required"]})
        } else {
            context.data.createUser(user)
                .then(errors => {
                    if(errors.length){
                        this.setState({errors})
                    } else {
                        context.actions.signIn(emailAddress, password)
                            .then(() => {
                                this.props.history.push("/");
                            })
                            console.log(`${emailAddress} is successfully signed up and authorized!`);
                        }
                })
                .catch(err => {
                    console.log(err);
                    this.props.history.push("/error");
                })
        }
    }

    cancel = () => {
        this.props.history.push('/');
        window.location.reload();
    }
}
