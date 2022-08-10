import express from 'express';
import User from '../interfaces/user.interface';

class UsersController {
  public path = '/users';
  public router = express.Router();
  private users: User[] = [
    {
      id: 1,
      name: 'John',
      email: 'jon@g.com',
    },
    {
      id: 2,
      name: 'Mike',
      email: 'mike@g.com',
    },
  ];
  constructor() {
    this.intializeRoutes();
  }
  public intializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.post(this.path, this.createUser);
  }
  public getAllUsers = (
    request: express.Request,
    response: express.Response
  ) => {
    response.json(this.users);
  };
  public createUser = (
    request: express.Request,
    response: express.Response
  ) => {
    const newUser: User = request.body;
    this.users.push(newUser);
    response.json(this.users);
  };
}
export default UsersController;
