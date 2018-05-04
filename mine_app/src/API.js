import axios from 'axios';

let API_PATH = 'http://localhost:8000';

export function getToken() {
  return localStorage.getItem('token');
}

export function getGames() {
  
  return axios.get(`${API_PATH}/api/game/`,
    {
      headers: { Authorization: `Token ${getToken()}`}
    })
}

export function login(username, password) {
  return axios.post(`${API_PATH}/api/auth/`, 
    {
      'username': username,
      'password': password
    }).then((response) => {
      localStorage.setItem('token', response.data.auth_token);
      return response.data.auth_token;
    });

}
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
