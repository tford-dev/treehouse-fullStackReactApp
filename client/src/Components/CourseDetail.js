import React, { Component } from 'react'
import NotFound from './NotFound';
import ReactMarkdown from 'react-markdown'

class CourseDetail extends Component {
    constructor(props){
        super(props);
        //del() on line 112 binded in constructor so method has access to props
        this.del = this.del.bind(this);
        this.state = {
            id: null,
            title: null,
            description: null,
            estimatedTime: null,
            materialsNeeded: null,
            userId: null,
            studentFirstName: null,
            studentLastName: null,
        };
     
    }

    componentDidMount() {
        const { context } = this.props;
        let key = this.props.match.params.id

        //Conditional statement to see if pathname contains "update" before communicating with api to retrieve courses
        if(window.location.pathname.indexOf("update") === -1){
            context.data.getCourse(key).then(
                //response uses this component's state to store course data 
                response => this.setState({
                    id: response.id,
                    title: response.title,
                    description: response.description,
                    estimatedTime: response.estimatedTime,
                    materialsNeeded: response.materialsNeeded,
                    userId: response.userId,
                    studentFirstName: response.student.firstName,
                    studentLastName: response.student.lastName,
                })
            )
            .catch(error => {
                console.log('Error ' + error);
                this.props.history.push("/error")
            });
        } else {
            return null;
        }
    }

    render(){
        const {context} = this.props;
        const authUser = context.authenticatedUser;
        const {
            id,
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId,
            studentFirstName,
            studentLastName
        } = this.state;
        return(
            (window.location.pathname.indexOf("update") === -1) ?
                //closing tag for <main> is on line 104
                <main>
                    <div className="actions--bar">
                        {   
                            //first operator to see if there is an authenticated user
                            (authUser) ?
                                //second operator to see if authenticated user owns the course
                                (authUser.userId === userId) ?
                                    //If true, update-course and delete buttons are rendered
                                    <div className="wrap">
                                        <a className="button" href={`/courses/${id}/update`}>Update Course</a>
                                        <button className="button" onClick={this.del}>Delete</button>
                                        <a className="button button-secondary" href="/">Return to List</a>
                                    </div>
                                    :
                                        //If false, only "return to list" is rendered
                                        <div className="wrap">
                                            <a className="button button-secondary" href="/">Return to List</a>
                                        </div>
                                :
                                    //If there is no authenticated user, "return to list" is rendered
                                    <div className="wrap">
                                            <a className="button button-secondary" href="/">Return to List</a>
                                        </div>
                        }
                    </div>

                    {
                        //This operator is placed here so that the <NotFound /> isn't rendered while waiting to retrieve course data
                        //After half a second, <NotFound /> is rendered
                        (id === null) ?
                            setTimeout(function(){<NotFound />}, 500)
                            :
                                <div className="wrap">
                                    <h2>CourseDetail</h2>
                                    <form>
                                        <div className="main--flex">
                                            <div>
                                                <h3 className="course--detail--title">Course</h3>
                                                <h4 className="course--name">{title}</h4>
                                                <p>By {studentFirstName} {studentLastName}</p>
                                                
                                                <ReactMarkdown children={description} />
                                                
                                            </div>
                                            <div>
                                                <h3 className="course--detail--title">Estimated Time</h3>
                                                <p>{estimatedTime}</p>

                                                <h3 className="course--detail--title">Materials Needed</h3>
                                                <ul className="course--detail--list">
                                                    <ReactMarkdown children={materialsNeeded} />
                                                </ul>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                    }
                </main>
                : null
        )
    }

    //Method to delete course
    del(){
        const {context} = this.props;
        const authUser = context.authenticatedUser;
        const {
            id,
            userId,
        } = this.state;
        //if course owner is authenticated user, a confirmation window appears to ask user if they are certain before deleting course
        if(userId === authUser.userId){
            if(window.confirm("Are sure you want to delete this course? Once deleted, it can not be retrieved.")){
                context.data.deleteCourse(id, authUser.emailAddress, authUser.password)
                    .then((response) => {
                        if(response === 'success'){
                            this.props.history.push(`/`);
                            //An alert window is triggered if user is not authorized to delete course
                            alert("Course Deleted.");
                            console.log("Course deleted");
                        } else {
                            this.setState(() => { 
                                return {
                                    errors: response.message
                                }   
                            });
                            this.props.history.push("/error");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this.props.history.push("/error");
                    })
            }
        } else {
            alert("You are not authorized to delete this course.")
        }
    }
}

export default CourseDetail;