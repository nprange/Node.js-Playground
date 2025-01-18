import http from "http";
import { json } from "./middlewares/json.js";
import { routes } from "./route.js";

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  await json(request, response);

  const route = routes.find((route) => {
    return route.method === method && route.path === url;
  });

  if (route) {
    return route.handler(request, response);
  }

  return response.writeHead(404).end();
});

server.listen(3333);
