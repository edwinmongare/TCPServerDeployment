const amqp = require("amqplib/callback_api");
const net = require("net");
const port = 5000;
const host = "20.71.208.82";

amqp.connect("amqp://20.71.208.82", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const queueOne = "tcpBoreholeMeter";
    const server = net.createServer();
    server.listen(port, host, () => {
      console.log("TCP Server is running on port " + port + ".");
    });
    try {
      server.on("connection", function (sock) {
        console.log("CONNECTED: " + sock.remoteAddress + ":" + sock.remotePort);

        sock.on("data", function (data) {
          console.log("DATA " + sock.remoteAddress + ": " + data);
          let dataPacket = data;

          // Write the data back to all the connected, the client will receive it as data from the server
          // sockets.forEach(function (sock, index, array) {
          //   sock.write(
          //     sock.remoteAddress + ":" + sock.remotePort + " said " + data + "\n"
          //   );
          // });
          channel.assertQueue(queueOne, {
            durable: true,
          });
          channel.sendToQueue(queueOne, dataPacket);
        });
      });
    } catch (error) {
      console.log(error.message);
    }
    server.on("error", (e) => {
      if (e.code === "EADDRINUSE") {
        console.log("Address in use, retrying...");
      }
    });
  });
});
