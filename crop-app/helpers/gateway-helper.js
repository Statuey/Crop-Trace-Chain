import pool from "../config/gateway.js";

/**
 * 获取 Fabric Gateway
 * @returns {Promise<import('@hyperledger/fabric-gateway').Gateway>}
 */
export async function getGateway() {
  return await pool.acquire();
}

export async function releaseGateway(client) {
  await pool.release(client);
}
