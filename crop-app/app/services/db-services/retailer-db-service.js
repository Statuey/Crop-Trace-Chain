import { connection } from "../../../helpers/db-helper.js";

export async function getRetailerName(retailerId) {
  const db = await connection();
  const sql = "SELECT retailerName FROM retailer WHERE retailerId =?";
  const results = await db.query(sql, retailerId);
  const retailerName = results[0][0].retailerName;
  db.release();
  return retailerName;
}

export async function getRetailerDetails(retailerId) {
  const db = await connection();
  const sql = "SELECT * FROM retailer WHERE retailerId =?";
  const results = await db.query(sql, retailerId);
  const infos = results[0][0];
  db.release();
  return infos;
}

export async function getTraderDetails(traderId) {
  const db = await connection();
  const sql = "SELECT * FROM traders WHERE traderId =?";
  const results = await db.query(sql, traderId);
  const infos = results[0][0];
  db.release();
  return infos;
}

export async function getTraders(retailerId) {
  const db = await connection();
  const sql = "SELECT * FROM traders WHERE retailerId =?";
  const results = await db.query(sql, retailerId);
  const infos = results[0];
  db.release();
  return infos;
}

export async function getTraderId(traderName) {
  const db = await connection();
  const sql = "SELECT traderId FROM traders WHERE traderName =?";
  var [results, _] = await db.query(sql, traderName);
  if (!results.length) {
    db.release();
    return;
  } else {
    const infos = results[0].traderId;
    db.release();
    return infos;
  }
}

export async function getRetailers() {
  const db = await connection();
  const sql = "SELECT retailerName FROM retailer";
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
