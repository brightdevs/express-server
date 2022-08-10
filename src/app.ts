import express from 'express';
import * as bodyParser from 'body-parser';

class App {
  public app: express.Application;
  public port: number;
  constructor(controller: express.RequestHandler, port: number) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeControllers(controller);
  }
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }
  private initializeControllers(controller: express.RequestHandler) {
    this.app.use('/', controller);
  }
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
export default App;
