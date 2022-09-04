const express = require("express");
const cors = require("cors");
const { socketController } = require("../sockets/controller");
class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 9000;
    this.server = require("http").createServer(this.app);
    this.io = require("socket.io")(this.server, {
      allowEIO3: true,
    });
    this.paths = {
      payment: "/api/payments",
    };

    // middleware: son funcionalidads para el webserver
    this.middlewares();
    // rutas de mi app
    this.routes();
    // sockets
    this.sockets();
  }

  sockets() {
    this.io.on("connection", socketController);
  }

  routes() {
    this.app.use(this.paths.payment, require("../routes/payment.routes"));
  }
  listen() {
    this.server.listen(this.port, () => {
      console.log(`Running in http://localhost:${this.port}`);
    });
  }

  middlewares() {
    // usar cors
    this.app.use(cors());
    this.app.use(
      express.json({
        verify: (req, res, buf) => {
          req.rawBody = buf;
        },
      })
    );
    // parseo de la info del body
    this.app.use(express.json());
    // directorio publico
    this.app.use(express.static("public"));
  }
}

module.exports = Server;
