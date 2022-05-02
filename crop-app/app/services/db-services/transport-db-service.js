import { connection } from "../../../helpers/db-helper.js";

export async function getServerName(serverId) {
  const db = await connection();
  const sql = "SELECT serverName FROM server WHERE serverId =?";
  const results = await db.query(sql, serverId);
  const serverName = results[0][0].serverName;
  db.release();
  return serverName;
}

export async function getServerDetails(serverId) {
  const db = await connection();
  const sql = "SELECT * FROM server WHERE serverId =?";
  const results = await db.query(sql, serverId);
  const infos = results[0][0];
  db.release();
  return infos;
}

export async function getDriverDetails(driverId) {
  const db = await connection();
  const sql = "SELECT * FROM drivers WHERE driverId =?";
  const results = await db.query(sql, driverId);
  const infos = results[0][0];
  db.release();
  return infos;
}

export async function getDrivers(serverId) {
  const db = await connection();
  const sql = "SELECT * FROM drivers WHERE serverId =?";
  const results = await db.query(sql, serverId);
  const infos = results[0];
  db.release();
  return infos;
}

export async function getDriverId(driverName) {
  const db = await connection();
  const sql = "SELECT driverId FROM drivers WHERE driverName =?";
  var [results, _] = await db.query(sql, driverName);
  if (!results.length) {
    db.release();
    return;
  } else {
    const infos = results[0].driverId;
    db.release();
    return infos;
  }
}

export async function getServers() {
  const db = await connection();
  const sql = "SELECT serverName FROM server";
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
