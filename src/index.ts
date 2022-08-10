import express from 'express';
import * as bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(loggerMiddleWare);
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at:https://localhost:${port}`);
});

function loggerMiddleWare(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  console.log(`${request.method} ${request.path}`);
  next();
}
