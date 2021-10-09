/* eslint-disable */ 
import React, {useEffect} from 'react';
import { Redirect } from 'react-router-dom';

//stateless component with an anonymous function to sign user out and redirect them to "/" route
export default ({context}) => {
	useEffect(()=> context.actions.signOut());
	return (
		<Redirect to="/" />
	);
}

