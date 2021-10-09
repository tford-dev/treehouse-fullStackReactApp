/* eslint-disable */ 

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './Context';

//Component that nests a UI component that requires authentication
	export default ({ component: Component, ...rest }) => {
	return (
		<Consumer>
		{ context => (
			<Route
			{...rest}
			//If the user is authenticated, user is allowed access to desired route
			render={props => context.authenticatedUser ? (
				<Component {...props} />
				//If user is not authenticated, they are redirected to "/signin" route
				) : (
				<Redirect to={{
					pathname: "/signin",
					state: {from: props.location},
				}}/>
				)
			}
			/>
		)}
		</Consumer>
		);
	};