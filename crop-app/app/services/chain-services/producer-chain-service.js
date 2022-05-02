import util from "util";
const utf8Decoder = new util.TextDecoder();
export async function initCrop(contract) {
  console.log(
    "\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger"
  );
  await contract.submitTransaction("InitCrop");
  console.log("*** Transaction committed successfully");
}

export async function createCrop(
  contract,
  crop_id,
  plant_id,
  plant_name,
  plant_date,
  harvest_date,
  crop_weight,
  create_time,
  current_phase,
  current_owner,
  intro,
  remarks
) {
  console.log(
    "\n--> Submit Transaction: CreateCrop, creates new asset with arguments"
  );

  await contract.submitTransaction(
    "CreateCrop",
    crop_id,
    plant_id,
    plant_name,
    plant_date,
    harvest_date,
    crop_weight,
    create_time,
    current_phase,
    current_owner,
    intro,
    remarks
  );

  console.log("*** Transaction committed successfully");
}

export async function updateCrop(
  contract,
  crop_id,
  plant_id,
  plant_name,
  plant_date,
  harvest_date,
  crop_weight,
  create_time,
  current_phase,
  current_owner,
  intro,
  remarks
) {
  console.log(
    "\n--> Submit Transaction: UpdateCrop, update the crop's information"
  );

  await contract.submitTransaction(
    "UpdateCrop",
    crop_id,
    plant_id,
    plant_name,
    plant_date,
    harvest_date,
    crop_weight,
    create_time,
    current_phase,
    current_owner,
    intro,
    remarks
  );

  console.log("*** Transaction committed successfully");
}

export async function initInfo(contract) {
  console.log(
    "\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger"
  );

  const result = await contract.submitTransaction("InitInfo");
  console.log("*** Transaction committed successfully");
}

export async function readInfo(contract, growId) {
  console.log(
    "\n--> Evaluate Transaction: ReadByGrow, function returns the grow info according to the growId"
  );
  const resultBytes = await contract.evaluateTransaction("ReadByGrow", growId);
  const resultJson = utf8Decoder.decode(resultBytes);
  const result = JSON.parse(resultJson);
  return result;
}

export async function queryAllInfos(contract, farmId) {
  console.log(
    "\n--> Evaluate Transaction: QueryByFarmId, function returns all the grow infos belong to this farm"
  );
  const resultBytes = await contract.evaluateTransaction(
    "QueryByFarmId",
    farmId
  );

  const resultJson = utf8Decoder.decode(resultBytes);
  const results = JSON.parse(resultJson);

  return results;
}

export async function recordInfo(
  contract,
  grow_id,
  crop_id,
  farm_id,
  farm_name,
  farmer_id,
  farmer_name,
  record_time,
  crop_grow_photo_url,
  grow_status,
  fertilizer_name,
  plat_mode,
  illumination_status,
  remarks
) {
  console.log("\n--> Submit Transaction: RecordInfo, record grow informations");

  await contract.submitTransaction(
    "RecordInfo",
    grow_id,
    crop_id,
    farm_id,
    farm_name,
    farmer_id,
    farmer_name,
    record_time,
    crop_grow_photo_url,
    grow_status,
    fertilizer_name,
    plat_mode,
    illumination_status,
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
