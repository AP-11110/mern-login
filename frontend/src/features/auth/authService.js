// service for dealing with http request and setting data in local storage
import axios from 'axios';

const API_URL = '/api/users/';

// register user
const register = async (userData) => {
    const response = await axios.post(API_URL, userData);

    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data)); // saving the data that came back via response
    }
    return response.data;
}

const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);

    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data)); // saving the data that came back via response
    }
    return response.data;
}

// logout user
const logout = () => {
    localStorage.removeItem('user');
}

const authService = {
    register,
    logout,
    login
}

export default authService;