import express from 'express';
import { getUserById } from '../controllers/user.controllers';

const route = express.Router();

route.get('/users', getUserById);

export default route;
