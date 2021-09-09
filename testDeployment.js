const Net = require("net");
const axios = require("axios");
const { stringify } = require("querystring");
const port = 5000;

const server = new Net.Server();
server.listen(port, function () {
  console.log(
    `Server listening for connection requests on socket localhost:${port}`
  );
});

server.on("connection", function (socket) {
  console.log("A new connection has been established.");
  // The server can also receive data from the client by reading from its socket.
  socket.on("data", function (chunk) {
    telemtryDataArray = [];
    const rawdata = JSON.parse(chunk);
    const telemetryData = JSON.parse(chunk);
    console.log(telemetryData);
    telemtryDataArray.push(telemetryData);
    for (let telemtry of telemtryDataArray) {
      telemtry = {
        imei: telemtry["imei_no"],
        deviceRuntime: telemtry["device_runtime"],
        batteryLevel: telemtry["battery_level"],
        liters: telemtry["litres_total"],
        aquiferLevel: telemtry["aquifer_level"],
        knocksCount: telemtry["knocks_count"],
        staticWaterLevel: telemtry["static_water_level"],
        totalDepth: telemtry["total_depth"],
      };
      console.log(`Data received: ${JSON.stringify(telemtry)}`);

      //**  post to http endpoint
      axios
        .post(
          "https://bahari2dev.azurewebsites.net/api/Borehole/SaveSensorTelemetry",
          JSON.stringify(telemtry),
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
    }
  });

  socket.on("end", function () {
    console.log("Closing connection with the client");
  });

  socket.on("error", function (err) {
    console.log(`Error: ${err}`);
  });
});
