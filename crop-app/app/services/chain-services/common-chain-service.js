import util from "util";
const utf8Decoder = new util.TextDecoder();

export async function readCrop(contract, cropId) {
  console.log(
    "\n--> Evaluate Transaction: read crop, function returns the detail of crop"
  );

  const resultBytes = await contract.evaluateTransaction("ReadCrop", cropId);
  const resultJson = utf8Decoder.decode(resultBytes);
  const result = JSON.parse(resultJson);
  return result;
}

export async function transactionCrop(contract, cropId, newPhase, newOwner) {
  console.log(
    "\n--> Async Submit Transaction: TransferCrop, updates existing crop owner"
  );
  const commit = await contract.submitTransaction(
    "TransferCrop",
    cropId,
    newPhase,
    newOwner
  );
  // const oldOwner = utf8Decoder.decode(commit.getResult());

  // console.log(
  //   `*** Successfully submitted transaction to transfer ownership from ${oldOwner} to Saptha`
  // );
  // console.log("*** Waiting for transaction commit");

  // const status = await commit.getStatus();
  // if (!status.successful) {
  //   throw new Error(
  //     `Transaction ${status.transactionId} failed to commit with status code ${status.code}`
  //   );
  // }

  console.log("*** Transaction committed successfully");
}

export async function queryByOwner(contract, farmname) {
  console.log(
    "\n--> Evaluate Transaction: QueryByOwner, function returns all the crop infos belong to this farm"
  );

  const resultBytes = await contract.evaluateTransaction(
    "QueryByOwner",
    farmname
  );
  const resultJson = utf8Decoder.decode(resultBytes);
  const results = JSON.parse(resultJson);
  return results;
}
