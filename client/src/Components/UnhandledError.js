import React, { Component } from 'react'; 

//Stateless component that is rendered when there is an error outside of invalid credentials or non-existent data in database
class Error extends Component {
    render(){
        return(
            <div className="wrap">
                <h2>Error</h2>
                <p>Sorry! We just encountered an unexpected error.</p>
            </div>
        )
    }
}

export default Error;