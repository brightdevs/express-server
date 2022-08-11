import express from 'express';
import * as bodyParser from 'body-parser';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
class App {
  public app: express.Application;
  public port: number;
  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`⚡️[server]: Server is running at: ${this.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
  private connectToTheDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    mongoose
      .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`)
      .then(() => console.log('⚡️[db connection]: success!! ヽ(ヅ)ノ'))
      .catch((err) => console.log('Error during connection! (✖╭╮✖)', err));
  }
}
export default App;
