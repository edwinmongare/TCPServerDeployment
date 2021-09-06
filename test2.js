const apiBase = require("./apiBase");

let imeiNo = ["865067025030191"];

apiBase.api.get("getMeterCodes").then(function (response) {
  const meterCodes = response.data;
  const result = meterCodes.map(function (obj) {
    return obj.MeterCode;
  });
  console.log(result, "results from api");
  const filteredArray = result.filter((value) => imeiNo.includes(value));
  console.log(filteredArray, "filtered array");

  console.log(imeiNo, "array of imeis");
  if (filteredArray.length > 0) {
    console.log("yass baby");
  } else {
    console.log("data not sent");
  }
});
