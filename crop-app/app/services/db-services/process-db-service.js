import { connection } from "../../../helpers/db-helper.js";

export async function getFactoryName(factoryId) {
  const db = await connection();
  const sql = "SELECT factoryName FROM factory WHERE factoryId =?";
  const results = await db.query(sql, factoryId);
  const factoryName = results[0][0].factoryName;
  db.release();
  return factoryName;
}

export async function getFactoryId(factoryName) {
  const db = await connection();
  const sql = "SELECT factoryId FROM factory WHERE factoryName =?";
  var [results, _] = await db.query(sql, factoryName);
  if (!results.length) {
    db.release();
    return;
  } else {
    const infos = results[0].factoryId;
    db.release();
    return infos;
  }
}

export async function getFactoryDetails(factoryId) {
  const db = await connection();
  const sql = "SELECT * FROM factory WHERE factoryId =?";
  const results = await db.query(sql, factoryId);
  const infos = results[0][0];
  db.release();
  return infos;
}

export async function getWorkshopDetails(workshopId) {
  const db = await connection();
  const sql = "SELECT * FROM workshops WHERE workshopId =?";
  const results = await db.query(sql, workshopId);
  const infos = results[0][0];
  db.release();
  return infos;
}

export async function getWorkshops(factoryId) {
  const db = await connection();
  const sql = "SELECT * FROM workshops WHERE factoryId =?";
  const results = await db.query(sql, factoryId);
  const infos = results[0];
  db.release();
  return infos;
}

export async function getWorkshopId(workshopName) {
  const db = await connection();
  const sql = "SELECT workshopId FROM workshops WHERE workshopName =?";
  var [results, _] = await db.query(sql, workshopName);
  if (!results.length) {
    db.release();
    return;
  } else {
    const infos = results[0].workshopId;
    db.release();
    return infos;
  }
}

export async function getFactorys() {
  const db = await connection();
  const sql = "SELECT factoryName FROM factory";
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
