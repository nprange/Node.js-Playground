import http from "http";

const users = [];

const server = http.createServer((resquest, response) => {
  const { method, url } = resquest;

  if (method === "GET" && url === "/users") {
    return response
      .setHeader("content-type", "application/json")
      .writeHead(201)
      .end(JSON.stringify(users));
  }

  if (method === "POST" && url === "/users") {
    users.push({
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
    });

    return response
      .setHeader("content-type", "application/json")
      .writeHead(201)
      .end();
  }

  return response.writeHead(404).end("Not found");
});

server.listen(3333);
