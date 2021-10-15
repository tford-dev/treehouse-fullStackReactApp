import React, { Component } from 'react';
import Form from "./Form";

class CreateCourse extends Component {
    constructor(props){
        super(props);
        this.state = {
            title: "", 
            description: "",
            estimatedTime: "",
            materialsNeeded: "", 
            userId: null,
            errors: []
        }
    }

    render(){
        const { context } = this.props;
        const authUser = context.authenticatedUser;
        //What user types into input boxes becomes is set to the corresponding state key using this.change on line 92
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            errors
        } = this.state;

        return(
            <div className="wrap">
                <h2>Create Course</h2>
                <Form 
                    cancel={this.cancel}
                    errors={errors}
                    submit={this.submit}
                    submitButtonText="Create Course"
                    elements={() => (
                        <React.Fragment>
                            <div className="main--flex">
                                <div>
                                    <label htmlFor="title">
                                        Course Title
                                    </label>
                                        <input 
                                            id="courseTitle" 
                                            name="title" 
                                            type="text" 
                                            onChange={this.change}
                                            value={title} 
                                            placeholder="Course Title"
                                        />

                                    <p>
                                        By {authUser.firstName} {authUser.lastName}
                                    </p>

                                    <label htmlFor="description">
                                        Course Description
                                        <textarea 
                                            value={description} 
                                            placeholder="Course Description" 
                                            name="description" 
                                            onChange={this.change} 
                                            id="courseDescription"
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="estimatedTime">
                                        Estimated Time
                                    </label>

                                        <input 
                                            id="estimatedTime" 
                                            name="estimatedTime" 
                                            onChange={this.change} 
                                            type="text" 
                                            value={estimatedTime}
                                            placeholder="Estimated Time"
                                        />

                                    <label htmlFor="materialsNeeded">
                                        Materials Needed
                                        <textarea 
                                            value={materialsNeeded} 
                                            placeholder="Materials Needed" 
                                            id="materialsNeeded" 
                                            name="materialsNeeded" 
                                            onChange={this.change} 
                                        />
                                    </label>
                                </div>
                            </div>
                        </React.Fragment> 
                    )} 
                />
            </div>
        )
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
        const authUser = context.authenticatedUser;
        const {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            errors
        } = this.state;

        const course = {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            errors,
            //userId is needed to get a 201 status code from api
            userId: authUser.userId
        };

        //createCourse method takes credentials from context api and course variable to execute request 
        if ((title === "" && description === "") || (title === " " && description === " ")){
            this.setState({errors: [...errors, "Title can not be empty!", "Description can not be empty!"]})
        } else if ((title === "") || (title === " ")){
            this.setState({errors: [...errors, "Title can not be empty!"]})
        } else if ((description === "") || (description === " ")){
            this.setState({errors: [...errors, "Description can not be empty!"]})
        } else {
            context.data.createCourse(course, authUser.emailAddress, authUser.password)
                .then(errors => {
                    if(errors.length){
                        this.setState({errors})
                    } else {
                        if(course.title === "" || course.description === ""){
                            this.setState({
                                errors: [...this.state.errors, "Title and description can not be empty!"]
                            });
                        } else {
                            console.log(`Username ${authUser.emailAddress} 
                            successfully created: ${course}`);
                            this.props.history.push('/');
                            }
                        }
                    }
                )
                .catch(err => {
                    console.log(err);
                    this.props.history.push("/error");
                })
        }
    }

    cancel = () => {
        this.props.history.push("/");
    }
}

export default CreateCourse;
