const amqp = require("amqplib/callback_api");
const axios = require("axios");
const apiBase = require("./apiBase");

amqp.connect("amqp://20.71.208.82", function async(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(
    function (error1, channel) {
      if (error1) {
        throw error1;
      }
      const queue = "tcpBoreholeMeter";
      channel.assertQueue(queue, {
        durable: true,
      });
      console.log(
        " [*] Waiting for messages in %s. To exit press CTRL+C",
        queue
      );
      channel.consume(queue, function (msg) {
        if (msg.length <= 0) {
          console.log("no message in queue");
        }
        const message = msg.content.toString();
        // const message = JSON.parse(msg.content.toString());
        let dataArraay = [];
        dataArraay.push(message);
        //   console.log(" [x] Received %s", message);

        const messageTwo = {
          "imei": "865067025030191",
          "deviceRuntime": "0",
          "batteryLevel": "200",
          "liters": "0",
          "aquiferLevel": "0",
          "knocksCount": "0",
          "staticWaterLevel": "0",
          "totalDepth": "0",
          "dateSent": new Date(),
        };

        //**  post to http endpoint
        axios
          .post(
            "https://kisima.azurewebsites.net/api/Admin/SaveTelemetry",
            message,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(
            (response) => {
              console.log("tcp message", response.data);
              console.log("responseData Axios", response.status);
            },
            (error) => {
              console.log("errorData Axios", error.message);
            }
          );
      });
      // .catch(function (error) {
      //   console.log(error, "err");
      // });
    },
    {
      noAck: true,
    }
  );
});
