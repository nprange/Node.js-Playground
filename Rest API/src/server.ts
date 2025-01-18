import fastify from "fastify";
import { env } from "./env";
import { transactionRoute } from "./routes/transaction";

const app = fastify();

app.register(transactionRoute, { prefix: "transaction" });

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("HTTP Server Running");
  });
