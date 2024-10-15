import axios from 'axios';

// const API = axios.create({ baseURL: 'https://team-collobration-hub.onrender.com/api' ,  });
const API = axios.create({ baseURL: 'http://localhost:5000/api' ,  });

export const registerUser = async (userData) => {
  return await API.post('/users/register', userData);
};

export const loginUser = async (userData) => {
  return await API.post('/users/login', userData);
};

export const getUsers = async () => {
  return await API.get('/users');
};

export const createTask = async (taskData) => {
  return await API.post('/tasks', taskData);
};

export const getTasks = async () => {
  return await API.get('/tasks');
};
