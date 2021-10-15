import React, {Component} from 'react';
import Form from "./Form";

class UpdateCourse extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: null,
            title: "", 
            description: "",
            estimatedTime: "",
            materialsNeeded: "", 
            userId: null,
            studentFirstName: null,
            studentLastName: null,
            errors: []
        }
        this.change = this.change.bind(this);
        this.submit = this.submit.bind(this);
    }


    componentDidMount() {
        const { context } = this.props;
        const authUser = context.authenticatedUser;
        let key = this.props.match.params.id;

        context.data.getCourse(key).then( response => {
            /*If there is a response and if the course belongs to the user, the state of 
            this component will hold key-value pairs from response*/
            if(response){
                if (response.userId === authUser.userId) {
                    this.setState({
                        id: response.id,
                        title: response.title,
                        description: response.description,
                        estimatedTime: response.estimatedTime,
                        materialsNeeded: response.materialsNeeded,
                        userId: response.userId,
                        studentFirstName: response.student.firstName,
                        studentLastName: response.student.lastName,
                    })
                //If course does not belong to user, they are redirected to the /forbidden route
                } else {
                    this.props.history.push("/forbidden");
                }
            //If there is no response at all, the user is redirected to the /notfound route
            } else {
                this.props.history.push("/notfound");
            }
        })
        .catch(error => {
            console.log('Error ' + error);
            this.props.history.push("/error")
        });
    }

    render(){
        //What user types into input boxes becomes is set to the corresponding state key using this.change on line 123
        const  {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            studentFirstName,
            studentLastName,
            errors
        } = this.state;

        return(
            <div className="wrap">
                <h2>Update Course</h2>
                <Form 
                    cancel={this.cancel}
                    errors={errors}
                    submit={this.submit}
                    submitButtonText="Update Course"
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
                                            defaultValue={title} 
                                        />

                                    <p>
                                        By {studentFirstName} {studentLastName}
                                    </p>

                                    <label htmlFor="description">
                                        Course Description
                                        <textarea 
                                            defaultValue={description} 
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
                                            defaultValue={estimatedTime} 
                                        />

                                    <label htmlFor="materialsNeeded">
                                        Materials Needed
                                        <textarea 
                                            defaultValue={materialsNeeded} 
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
        console.log(this.state)
    }

    //Submit method takes required keys from state and sends the values to api 
    submit = () => {
        const {context} = this.props;
        const authUser = context.authenticatedUser;
        const {
            id,
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId,
            errors
        } = this.state;

        const course = {
            id,
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId,
            errors
        };

        //updateCourse method takes credentials from context api and course variable to execute request 
        if ((title === "" && description === "") || (title === " " && description === " ")){
            this.setState({errors: [...errors, "Title can not be empty!", "Description can not be empty!"]})
        } else if ((title === "") || (title === " ")){
            this.setState({errors: [...errors, "Title can not be empty!"]})
        } else if ((description === "") || (description === " ")){
            this.setState({errors: [...errors, "Description can not be empty!"]})
        } else {
            context.data.updateCourse(course, 
                authUser.emailAddress,
                authUser.password
                ).then((response) => {
                    if(response === "success"){
                        console.log(`Username ${authUser.emailAddress} 
                        successfully updated: course #${id}`);
                        this.props.history.push(`/courses/${id}`);
                    } else if (response === "forbidden"){
                        this.props.history.push("/forbidden")
                    } else {
                        this.props.history.push("/error")
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.props.history.push("/error");
                })
        }
    }

    cancel = () => {
        this.props.history.push(`/courses/${this.state.id}`);
    }
}

export default UpdateCourse;
