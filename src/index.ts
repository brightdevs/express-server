import dotenv from 'dotenv';
import App from './app';
dotenv.config();
const port = process.env.PORT;
import UsersController from './users/users.controller';
const app = new App([new UsersController()], port as unknown as number);
app.listen();
