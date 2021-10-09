import React, { Component } from 'react'; 

class Forbidden extends Component {
    render(){
        return(
            <main>
                <div className="wrap">
                    <h2>Forbidden</h2>
                    <p>Access Denied. You do not have the credentials to access this page.</p>
                </div>
            </main>
        )
    }
}

export default Forbidden;