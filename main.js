var microBitBle;

var gpioPort2;
var channel;
var status = 0;

async function connect() {
  microBitBle = await microBitBleFactory.connect();
  msg.innerHTML = "micro:bit BLE接続しました。";
  var gpioAccess = await microBitBle.requestGPIOAccess();
  var mbGpioPorts = gpioAccess.ports;

  var relay = RelayServer("achex", "KandKSocket");
  channel = await relay.subscribe("KandKSensors");

  gpioPort2 = mbGpioPorts.get(2);
  await gpioPort2.export("in"); //port2 in
  gpioPort2.onchange = testChange;

  mainloop();
}

async function disconnect() {
  await microBitBle.disconnect();
  msg.innerHTML = "micro:bit BLE接続を切断しました。";
}

function testChange(val) {
  msgTxt = val === 1 ? "High" : "Low"; // 条件 (三項) 演算子
  status = val === 1 ? 0 : 1;
  msg.innerHTML = msgTxt;
}

async function mainloop() {
  while (true) {
    channel.send({ stPeople: status });
    await sleep(100);
  }
}
