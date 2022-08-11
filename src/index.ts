import App from './app';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT;
import UsersController from './controllers/users.controller';
import AuthenticationController from './controllers/authentication.controller';
const app = new App(
  [new UsersController(), new AuthenticationController()],
  port as unknown as number
);
app.listen();
