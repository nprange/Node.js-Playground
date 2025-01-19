import fastifyCookie from "@fastify/cookie";
import fastify from "fastify";

import { transactionRoute } from "./routes/transaction";

export const app = fastify();

app.register(fastifyCookie);
app.register(transactionRoute, { prefix: "transaction" });
