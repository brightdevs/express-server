import * as bcrypt from 'bcrypt';
import express from 'express';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import CreateUserDTO from '../DTO/user.dto';
import userModel from '../models/users.model';
import LogInDTO from '../DTO/login.dto';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private user = userModel;
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDTO),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDTO),
      this.loggingIn
    );
  }
  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDTO = request.body;
    if (await this.user.findOne({ email: userData.email })) {
      next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      response.send({
        name: user.name,
        email: user.email,
      });
    }
  };
  private loggingIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const logInData: LogInDTO = request.body;
    const user = await this.user.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.password
      );
      if (isPasswordMatching) {
        response.send(user);
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  };
}

export default AuthenticationController;
