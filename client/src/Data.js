class Data {
    api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
        const api = 'http://localhost:5000/api';
        const url = api + path;

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            }
        };

        if(body !== null) {
            options.body = JSON.stringify(body);
        }

        if(requiresAuth){
            const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
            options.headers['Authorization'] = `Basic ${encodedCredentials}`;
        }

        return fetch(url, options);
    }

    //GET request to retrieve user data
    async getUser(emailAddress, password) {
        const response = await this.api(`/users`, 'GET', null, true, {emailAddress, password});
        if (response.status === 200) {
            return response.json().then(data => data)
        }
        else if (response.status === 401) {
            return null;
        }
        else {
            throw new Error();
        }
    }

    //POST request to create user
    async createUser(user) {
        const response = await this.api('/users', 'POST', user);
        if (response.status === 201) {
            return [];
        }
        else if (response.status === 400) {
            return response.json().then(data => {
                return data.message;
            });
        }
        else {
            throw new Error();
        }
    }

    //GET request to retrieve all courses
    async getCourses() {
        const response = await this.api('/courses', 'GET', null, false, null);
        if(response.status === 200) {
            return response.json().then(data => data);
        } else if (response.status === 400) {
            return response.json().then(data => {
                return data.errors;
            });
        } else {
            throw new Error();
        }
    }

    //GET request to retrieve an individual course
    async getCourse(id){
        const response = await this.api(`/courses/${id}`, 'GET', null, false, null)
        if(response.status === 200) {
            return response.json().then(data => data);
        } else if (response.status === 400) {
            return response.json().then(data => {
                return data.errors;
            });
        } else {
            throw new Error();
        }
    }

    //PUT request to edit/update a course
    async updateCourse(obj, emailAddress, password) {
        const response = await this.api(`/courses/${obj.id}`, 'PUT', obj, true, {emailAddress, password});
        if(obj.title.length > 0 && obj.description.length > 0){
            if (response.status === 204) {
                return "success";
            } else if (response.status === 401 || 403) {
                return "forbidden";
            }
        } else if (response.status === 400) {
            return response.json().then(data => {
                return data.errors;
            })
        } else {
            throw new Error();
        }
    }

    //POST request to create a course
    async createCourse(obj, emailAddress, password) {
        const response = await this.api(`/courses`, 'POST', obj, true, {emailAddress, password});
        if(obj.title.length > 0 && obj.description.length > 0){
            if (response.status === 201) {
                return "success";
            } else if (response.status === 401 || 403) {
                return "forbidden";
            }
        } else if (response.status === 400) {
            return response.json().then(data => {
                return data.errors;
            })
        } else {
            throw new Error();
        }
    }

    //DELETE request to delete a course from the database
    async deleteCourse(id, emailAddress, password) {
       const response = await this.api(`/courses/${id}`, 'DELETE', null, true, {emailAddress, password});
       if(response.status === 204){
            return "success";
       } else if (response.status === 403 ) {
           console.log(response.message);
           return "forbidden";
       } else {
           throw new Error();
       }
    }
}

export default Data;
