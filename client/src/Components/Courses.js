import React, { Component } from 'react'

class Courses extends Component {
    constructor(props){
        super(props);
        this.state = {
            courses: []
        }
    }

    //When courses ("/") is loaded, getCourses pushes response into this.state.courses array
    componentDidMount() {
        const { context } = this.props;
        context.data.getCourses().then(
            response => this.setState({courses: response})
        )
        .catch(error => {
            console.log('Error ' + error);
        });
    }
        
    render(){
        const indexArr = this.state.courses.map(course => {
            return <a className="course--module course--link" key={course.id} href={"/courses/" + course.id}>
                <h2 className="course--label">Course</h2>
                <h3 className="course--title">{course.title}</h3>
            </a>
        })
        
        return(
            <main>
                <div className="wrap main--grid">
                    {indexArr}
                    <a className="course--module course--add--module" href="/courses/create">
                        <span className="course--add--title">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 13 13" className="add"><polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon></svg>
                            New Course
                        </span>
                    </a>   
                </div>
            </main>
        )
    }
}

export default Courses;