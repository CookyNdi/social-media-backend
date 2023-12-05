import express from 'express';
import { getUserByUsername, login, register, updateUserData } from '../controllers/user.controllers';

const route = express.Router();

route.post('/api/users/register', register);
route.post('/api/users/login', login);
route.get('/api/users/:username', getUserByUsername);

route.patch('/api/users', updateUserData);

export default route;
