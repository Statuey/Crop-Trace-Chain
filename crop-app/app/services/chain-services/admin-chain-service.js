import util from "util";
const utf8Decoder = new util.TextDecoder();

export async function getAllCrops(contract) {
  console.log(
    "\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger"
  );
  const resultBytes = await contract.evaluateTransaction("QueryAllCrops");
  const resultJson = utf8Decoder.decode(resultBytes);
  console.log(typeof resultJson);
  const results = JSON.parse(resultJson);
  return results;
}
