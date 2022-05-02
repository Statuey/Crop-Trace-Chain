import util from "util";
import crypto from "crypto";
const utf8Decoder = new util.TextDecoder();

export async function readProduct(contract, productId) {
  console.log(
    "\n--> Evaluate Transaction: ReadByProduct, function returns the product info according to the productId"
  );
  const resultBytes = await contract.evaluateTransaction(
    "ReadByProduct",
    productId
  );
  const resultJson = utf8Decoder.decode(resultBytes);
  const result = JSON.parse(resultJson);
  return result;
}

export async function queryAllProducts(contract, retailerId) {
  console.log(
    "\n--> Evaluate Transaction: QueryByRetailerId, function returns all the product infos belong to this retailer"
  );

  const resultBytes = await contract.evaluateTransaction(
    "QueryByRetailer",
    retailerId
  );
  const resultJson = utf8Decoder.decode(resultBytes);
  const results = JSON.parse(resultJson);
  return results;
}

export async function recordProduct(
  contract,
  productID,
  cropID,
  retailerID,
  retailerName,
  traderID,
  traderName,
  retailerCerUrl,
  buyoutTime,
  remarks
) {
  console.log(
    "\n--> Submit Transaction: RecordProduct, record product informations"
  );

  await contract.submitTransaction(
    "RecordProduct",
    productID,
    cropID,
    retailerID,
    retailerName,
    traderID,
    traderName,
    retailerCerUrl,
    buyoutTime,
    remarks
  );
}

export async function updateProduct(
  productID,
  cropID,
  retailerID,
  retailerName,
  traderID,
  traderName,
  retailerCerUrl,
  buyoutTime,
  remarks
) {
  console.log(
    "\n--> Submit Transaction: RecordProduct, record product informations"
  );

  await contract.submitTransaction(
    "UpdateProduct",
    productID,
    cropID,
    retailerID,
    retailerName,
    traderID,
    traderName,
    retailerCerUrl,
    buyoutTime,
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

export async function generateHash(
  contract1,
  contract2,
  contract3,
  contract4,
  contract5,
  cropId
) {
  let contracts = [contract2, contract3, contract4, contract5];
  let results = [];
  for (var i = 0; i < contracts.length; i++) {
    const resultBytes = await contracts[i].evaluateTransaction(
      "QueryByCrop",
      cropId
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    results.push(result);
  }

  const buf = Buffer.from(results);
  var hash = crypto.createHash("sha256");
  hash.update(buf);
  var res = hash.digest("hex");
  // console.log(res);
  return res;
}
