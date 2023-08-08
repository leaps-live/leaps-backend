import express from "express";
import path from "path";
import cors from "cors";

require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", require("./routers/users"));
app.use("/leagues", require("./routers/leagues"));
app.use("/leagueteam", require("./routers/leagueteam"));
app.use("/game", require("./routers/games"));
app.use("/team", require("./routers/teams"));
app.use("/teamplayer", require("./routers/teamplayer"));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
