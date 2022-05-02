import express from "express";
import { getGateway } from "../../helpers/gateway-helper.js";
import { getAllCrops } from "../services/admin-chain-service.js";
import { readCrop } from "../services/common-chain-service.js";

const router = express.Router();
const ccName1 = "crop";
const ccName2 = "producer";
const ccName3 = "transport";
const ccName4 = "process";
const ccName5 = "retailer";
const channelName = "mychannel";
//显示所有创建的订单
router.get("/", async (req, res) => {
  const gateway = await getGateway();
  const network = gateway.getNetwork(channelName);
  const contract = network.getContract(ccName1);
  try {
    const results = await getAllCrops(contract);
    console.log(results);
    res.send("success!");
  } catch (err) {
    console.error(err);
    res.send("failed!");
  }
});

//显示单个订单信息
router.get("/:cropId", async (req, res) => {
  const cropId = req.params.cropId;
  const gateway = await getGateway();
  const network = gateway.getNetwork(channelName);
  const contract = network.getContract(ccName1);
  try {
    const results = await readCrop(contract, cropId);
    console.log(results);
    res.send("success!");
  } catch (err) {
    console.error(err);
    res.send("failed!");
  }
});
export default router;
