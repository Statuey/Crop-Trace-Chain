import { connection } from "../../../helpers/db-helper.js";

export async function getFarmName(farmId) {
  const db = await connection();
  const sql = "SELECT farmName FROM farm WHERE farmId =?";
  const results = await db.query(sql, farmId);
  const farmName = results[0][0].farmName;
  db.release();
  return farmName;
}

export async function getFarmDetails(farmId) {
  const db = await connection();
  const sql = "SELECT * FROM farm WHERE farmId =?";
  var [results, _] = await db.query(sql, farmId);
  if (!results.length) {
    db.release();
    return;
  } else {
    const infos = results[0];
    db.release();
    return infos;
  }
}

export async function getFarmerDetails(farmerId) {
  const db = await connection();
  const sql = "SELECT * FROM farmers WHERE farmerId =?";
  const results = await db.query(sql, farmerId);
  const infos = results[0][0];
  console.log(infos);
  db.release();
  return infos;
}

export async function getFarmers(farmId) {
  const db = await connection();
  const sql = "SELECT * FROM farmers WHERE farmId =?";
  var [results, _] = await db.query(sql, farmId);
  if (!results.length) {
    db.release();
    return;
  } else {
    const infos = results;
    db.release();
    return infos;
  }
}

export async function getFarmerId(farmerName) {
  const db = await connection();
  const sql = "SELECT farmerId FROM farmers WHERE farmerName =?";
  var [results, _] = await db.query(sql, farmerName);
  if (!results.length) {
    db.release();
    return;
  } else {
    const infos = results[0].farmerId;
    db.release();
    return infos;
  }
}

export async function getPlantId(plantName) {
  const db = await connection();
  const sql = "SELECT plantId FROM plantIndex WHERE plantName =?";
  const results = await db.query(sql, plantName);
  const infos = results[0][0].plantId;
  db.release();
  return infos;
}

export async function getPlants() {
  const db = await connection();
  const sql = "SELECT plantName FROM plantIndex";
  const results = await db.query(sql);
  const infos = results[0];
  db.release();
  return infos;
}

export async function getFarms() {
  const db = await connection();
  const sql = "SELECT farmName FROM farm";
  var [results, _] = await db.query(sql);
  if (!results.length) {
    db.release();
    return;
  } else {
    const infos = results;
    db.release();
    return infos;
  }
}
