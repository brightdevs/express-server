import App from './app';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT;
import UsersController from './controllers/users.controller';
const app = new App([new UsersController()], port as unknown as number);
app.listen();
