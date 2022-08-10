import express from 'express';
import User from '../interfaces/user.interface';
import userModel from '../models/users.model';
class UsersController {
  public path = '/users';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }
  public intializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.post(this.path, this.createUser);
    this.router.get(`${this.path}/:id`, this.getUserById);
  }
  public getUserById = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;

    userModel
      .findById(id)
      .then((user) => {
        response.status(200).json(user);
      })
      .catch((err) => {
        response.status(400).json({
          error: err,
        });
      });
  };

  public getAllUsers = (
    request: express.Request,
    response: express.Response
  ) => {
    userModel.find().then((users) => {
      response.json(users);
    });
  };
  public createUser = (
    request: express.Request,
    response: express.Response
  ) => {
    const newUser: User = request.body;
    const createdUser = new userModel(newUser);
    createdUser
      .save()
      .then((user) => {
        response.json(user);
      })
      .catch((err) => {
        response.json(err);
      });
  };
}
export default UsersController;
