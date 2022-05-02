import util from "util";
const utf8Decoder = new util.TextDecoder();

export async function readMachining(contract, machiningId) {
  console.log(
    "\n--> Evaluate Transaction: ReadByMachining, function returns the machining info according to the machiningId"
  );
  const resultBytes = await contract.evaluateTransaction(
    "ReadByMachining",
    machiningId
  );
  const resultJson = utf8Decoder.decode(resultBytes);
  const result = JSON.parse(resultJson);
  return result;
}

export async function queryAllMachinings(contract, factoryId) {
  console.log(
    "\n--> Evaluate Transaction: QueryByFactoryrId, function returns all the machining infos belong to this factory"
  );

  const resultBytes = await contract.evaluateTransaction(
    "QueryByFactoryId",
    factoryId
  );
  const resultJson = utf8Decoder.decode(resultBytes);
  const results = JSON.parse(resultJson);
  return results;
}

export async function recordMachining(
  contract,
  machiningID,
  cropID,
  factoryID,
  factoryName,
  workshopID,
  workshopName,
  testingResult,
  inFactoryTime,
  outFactoryTime,
  testingPhotoUrl,
  remarks
) {
  console.log(
    "\n--> Submit Transaction: RecordMachining, record grow informations"
  );

  await contract.submitTransaction(
    "RecordMachining",
    machiningID,
    cropID,
    factoryID,
    factoryName,
    workshopID,
    workshopName,
    testingResult,
    inFactoryTime,
    outFactoryTime,
    testingPhotoUrl,
    remarks
  );
}

export async function updateMachining(
  machiningID,
  cropID,
  factoryID,
  factoryName,
  workshopID,
  workshopName,
  testingResult,
  inFactoryTime,
  outFactoryTime,
  testingPhotoUrl,
  remarks
) {
  console.log(
    "\n--> Submit Transaction: RecordMachining, record machining informations"
  );

  await contract.submitTransaction(
    "UpdateMachining",
    machiningID,
    cropID,
    factoryID,
    factoryName,
    workshopID,
    workshopName,
    testingResult,
    inFactoryTime,
    outFactoryTime,
    testingPhotoUrl,
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
