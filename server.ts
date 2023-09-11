import { App } from "./app";

import env from "./lib/env";

const PORT: number = env.PORT;

const app = new App(PORT);

app.listen();
