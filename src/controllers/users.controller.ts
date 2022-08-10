import express from 'express';
import User from '../interfaces/user.interface';
import _userModel from '../models/users.model';
class UsersController {
  public path = '/users';
  public router = express.Router();
  private userModel = _userModel;

  constructor() {
    this.intializeRoutes();
  }
  private intializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.get(`${this.path}/:id`, this.getUserById);
    this.router.patch(`${this.path}/:id`, this.modifyUser);
    this.router.delete(`${this.path}/:id`, this.deleteUser);
    this.router.post(this.path, this.createUser);
  }
  private getUserById = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;

    this.userModel
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
  private modifyUser = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const user: User = request.body;

    this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .then((user) => {
        response.status(200).json(user);
      })
      .catch((err) => {
        response.status(400).json({
          error: err,
        });
      });
  };

  private deleteUser = (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;

    this.userModel.findByIdAndDelete(id).then((successResponse) => {
      if (successResponse) {
        response.sendStatus(200);
      } else {
        response.sendStatus(404);
      }
    });
  };

  private getAllUsers = (
    request: express.Request,
    response: express.Response
  ) => {
    this.userModel.find().then((users) => {
      response.json(users);
    });
  };
  private createUser = (
    request: express.Request,
    response: express.Response
  ) => {
    const newUser: User = request.body;
    const createdUser = new this.userModel(newUser);
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
