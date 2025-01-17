import http from "http";

const users = [];

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  const buffers = [];

  for await (const chunk of request) {
    buffers.push(chunk);
  }

  try {
    request.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    request.body = null;
  }

  if (method === "GET" && url === "/users") {
    return response
      .setHeader("content-type", "application/json")
      .writeHead(201)
      .end(JSON.stringify(users));
  }

  if (method === "POST" && url === "/users") {
    const { name, email } = request.body;
    users.push({
      id: 1,
      name,
      email,
    });

    return response
      .setHeader("content-type", "application/json")
      .writeHead(201)
      .end();
  }

  return response.writeHead(404).end("Not found");
});

server.listen(3333);
