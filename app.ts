import cors from "cors";
import express, { type Express } from "express";
import authRouter from "./routers/auth";

const PORT = process.env.PORT || 8080;

export class App {
  app: Express;
  port: number;

  constructor(port: number) {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.port = port;
    this.setupRoutes();
  }

  public setupRoutes() {
    this.app.use("/users", require("./routers/users"));
    this.app.use("/leagues", require("./routers/leagues"));
    this.app.use("/leagueteam", require("./routers/leagueteam"));
    this.app.use("/game", require("./routers/games"));
    this.app.use("/teams", require("./routers/teams"));
    this.app.use("/teamplayer", require("./routers/teamplayer"));
    this.app.use("/auth", authRouter);
  }

  public listen() {
    this.app.listen(this.port, () =>
      console.log(`Server listening on port ${PORT}`)
    );
  }
}
