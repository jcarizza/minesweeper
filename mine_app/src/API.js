import axios from 'axios';

let API_PATH = 'http://localhost:8000';

export function getToken() {
  return localStorage.getItem('token');
}


export function saveGame(data, id) {
  
  return axios.put(`${API_PATH}/api/game/${id}/update_map/`,
    {map_json: data},
    {
      headers: { Authorization: `Token ${getToken()}`}
    }).then(response => { return response.data })
}


export function createGame(data) {
  
  return axios.post(`${API_PATH}/api/game/`,
    data,
    {
      headers: { Authorization: `Token ${getToken()}`}
    }).then(response => {
      return response.data
    })
}

export function getGames() {
  
  return axios.get(`${API_PATH}/api/game/`,
    {
      headers: { Authorization: `Token ${getToken()}`}
    }).then(response => {
      return response.data
    })
}

export function getGame(id) {
  
  return axios.get(`${API_PATH}/api/game/${id}/`,
    {
      headers: { Authorization: `Token ${getToken()}`}
    }).then(response => {
      return response.data
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
