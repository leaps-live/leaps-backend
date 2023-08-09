import { App } from "./app";

require("dotenv").config();

const PORT: number = parseInt(process.env.PORT || "8080");

const app = new App(PORT);

app.listen();
