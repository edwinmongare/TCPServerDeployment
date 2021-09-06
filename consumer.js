const amqp = require("amqplib/callback_api");
const axios = require("axios");
const apiBase = require("./apiBase");

amqp.connect("amqp://localhost", function async(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = "tcpBoreholeMeter";
    channel.assertQueue(queue, {
      durable: true,
    });
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(
      queue,
      function (msg) {
        if (msg.length <= 0) {
          console.log("no message in queue");
        }
        const message = msg.content.toString();
        // const message = JSON.parse(msg.content.toString());
        let dataArraay = [];
        let imeiNo = [];
        dataArraay.push(message);
        //   console.log(" [x] Received %s", message);
        apiBase.api
          .get("getMeterCodes")
          .then(function (response) {
            const meterCodes = response.data;
            const result = meterCodes.map(function (obj) {
              return obj.MeterCode;
            });
            for (let item of dataArraay) {
              imeiNo.push(item["imei_no"]);
            }
            const filteredArray = result.filter((value) =>
              imeiNo.includes(value)
            );
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
            if (filteredArray.length > 0) {
              //**  post to http endpoint
              axios
                .post(
                  "https://kisima.azurewebsites.net/api/Admin/SaveTelemetry",
                  messageTwo,
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
            } else {
              console.log("data not sent");
            }
          })
          .catch(function (error) {
            console.log(error, "err");
          });
      },
      {
        noAck: true,
      }
    );
  });
});
