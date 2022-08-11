import express from 'express';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import HttpException from '../exceptions/HttpException';
import User from '../interfaces/user.interface';
import _userModel from '../models/users.model';
import CreateUserDTO from '../DTO/user.dto';
import validationMiddleware from '../middleware/validation.middleware';
class UsersController {
  public path = '/users';
  public router = express.Router();
  private userModel = _userModel;

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.get(`${this.path}/:id`, this.getUserById);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(CreateUserDTO, true),
      this.modifyUser
    );
    this.router.delete(`${this.path}/:id`, this.deleteUser);
    this.router.post(
      this.path,
      validationMiddleware(CreateUserDTO),
      this.createUser
    );
  }
  private getUserById = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;

    this.userModel
      .findById(id)
      .then((user) => {
        if (user) {
          response.status(200).json(user);
        } else {
          next(new UserNotFoundException(id));
        }
      })
      .catch((err) => {
        response.status(400).json({
          error: err,
        });
      });
  };
  private modifyUser = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const user: User = request.body;

    this.userModel
      .findByIdAndUpdate(id, user, { new: true })
      .then((user) => {
        if (user) {
          response.status(200).json(user);
        } else {
          next(new UserNotFoundException(id));
        }
      })
      .catch((err) => {
        response.status(400).json({
          error: err,
        });
      });
  };

  private deleteUser = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;

    this.userModel.findByIdAndDelete(id).then((successResponse) => {
      if (successResponse) {
        response.sendStatus(200);
      } else {
        next(new UserNotFoundException(id));
      }
    });
  };

  private getAllUsers = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    this.userModel.find().then((users) => {
      if (users) {
        response.json(users);
      } else {
        next(new HttpException(400, 'No data available!'));
      }
    });
  };
  private createUser = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const newUser: User = request.body;
    const createdUser = new this.userModel(newUser);
    createdUser
      .save()
      .then((user) => {
        if (user) {
          response.json(user);
        } else {
          next(new HttpException(400, 'User not created!'));
        }
      })
      .catch((err) => {
        response.json(err);
      });
  };
}
export default UsersController;
