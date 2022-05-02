import util from "util";
const utf8Decoder = new util.TextDecoder();

export async function readCargo(contract, cargoId) {
  console.log(
    "\n--> Evaluate Transaction: ReadByCargo, function returns the cargo info according to the cargoId"
  );
  const resultBytes = await contract.evaluateTransaction(
    "ReadByCargo",
    cargoId
  );
  const resultJson = utf8Decoder.decode(resultBytes);
  const result = JSON.parse(resultJson);
  return result;
}

export async function queryAllCargos(contract, serverId) {
  console.log(
    "\n--> Evaluate Transaction: QueryByServerId, function returns all the cargo infos belong to this server"
  );

  const resultBytes = await contract.evaluateTransaction(
    "QueryByServerId",
    serverId
  );
  const resultJson = utf8Decoder.decode(resultBytes);
  const results = JSON.parse(resultJson);
  return results;
}

export async function recordCargo(
  contract,
  cargoID,
  cropID,
  serverID,
  serverName,
  driverID,
  driverName,
  onchainTime,
  currentAddress,
  destination,
  remarks
) {
  console.log(
    "\n--> Submit Transaction: RecordCargo, record grow informations"
  );

  await contract.submitTransaction(
    "RecordCargo",
    cargoID,
    cropID,
    serverID,
    serverName,
    driverID,
    driverName,
    onchainTime,
    currentAddress,
    destination,
    remarks
  );
}

export async function updateCargo(
  cargoID,
  cropID,
  serverID,
  serverName,
  driverID,
  driverName,
  onchainTime,
  currentAddress,
  destination,
  remarks
) {
  console.log(
    "\n--> Submit Transaction: RecordCargo, record cargo informations"
  );

  await contract.submitTransaction(
    "UpdateCargo",
    cargoID,
    cropID,
    serverID,
    serverName,
    driverID,
    driverName,
    onchainTime,
    currentAddress,
    destination,
    remarks
  );
}

export async function queryByCrop(contract, cropId) {
  console.log("\n--> Evaluate Transaction: QueryByCrop");

  const resultBytes = await contract.evaluateTransaction("QueryByCrop", cropId);
  const resultJson = utf8Decoder.decode(resultBytes);
  const result = JSON.parse(resultJson);
  return result;
}
