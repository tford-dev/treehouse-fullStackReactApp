/* eslint-disable */ 
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

//importing components that will be wrapped in withContext()
import Courses from "./Components/Courses";
import UserSignUp  from './Components/UserSignUp';
import UserSignIn from './Components/UserSignIn';
import UserSignOut from './Components/UserSignOut';
import UpdateCourse from './Components/UpdateCourse';
import Header from './Components/Header';
import CreateCourse from './Components/CreateCourse';
import CourseDetail from './Components/CourseDetail';
import Error from './Components/UnhandledError';
import Forbidden from './Components/Forbidden';
import NotFound from './Components/NotFound';

import withContext from "./Context";
import PrivateRoute from "./PrivateRoute";
const HeaderWithContext = withContext(Header);
const CoursesWithContext = withContext(Courses);
const CourseDetailWithContext = withContext(CourseDetail);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);

function App() {
	return(
		<Router>
		<div>
			<HeaderWithContext />
			<Switch>
			<Route exact path="/" exact component={CoursesWithContext} />
			<Redirect exact from="/courses" to="/" />
			<Route path="/signin" component={UserSignInWithContext} />
			<Route path="/signup" component={UserSignUpWithContext} />
			<PrivateRoute exact path="/courses/create" component={CreateCourseWithContext} />
			<PrivateRoute path="/courses/:id/update" component={UpdateCourseWithContext} />
			<Route path="/courses/:id" component={CourseDetailWithContext} />
			<Route path="/error" component={Error} />
			<Route path="/forbidden" component={Forbidden} />
			<Route path="/notfound" component={NotFound} />
			<Route path="/signout" component={UserSignOutWithContext} />
			<Redirect from="*" to="/error" />
			</Switch>
		</div>
		</Router>
	)
} 
export default App;
