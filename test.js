const js = [
  {
    "packet_id": "1",
    "imei_no": "865067025030191",
    "device_runtime": "0",
    "battery_level": "4087",
    "litres_total": "0",
    "aquifer_level": "0.0",
    "knocks_count": "0.00",
    "device_latitude": "-1.284349",
    "device_longitude": "36.646945",
    "population": "560",
    "static_water_level": "12.5",
    "total_depth": "127",
    "installation_date": "2020",
    "customer_id": "2",
    "location_name": "Gikambura Riu 1",
    "committee_name": "Gikambura Riu 1",
    "contact_person_name": "Kikuyu Water",
    "contact_person_phone": "00",
  },
];
for (let item of js) {
  item = {
    imei: item["imei_no"],
  };
  console.log(item, "js");
}
