import app from './server.js'
import connection from './database.js';
import http from 'http';
import { Server } from 'socket.io';


connection()

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
  },
});

io.on("connection", (socket) => {
    socket.on("enviar-mensaje-fron-back", (data) => {
      io.emit("mensaje-desde-servidor", { mensaje: data.contenido, auth: data.auth });
    });
    socket.on("disconnect", () => {
    });
  });



server.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
})