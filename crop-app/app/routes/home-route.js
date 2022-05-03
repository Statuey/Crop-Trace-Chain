import express from "express";
import passport from "passport";
import { connection } from "../../helpers/db-helper.js";
import { getGateway, releaseGateway } from "../../helpers/gateway-helper.js";
import { pushMessage } from "../../helpers/common-helper.js";
import {
  transactionCrop,
  queryByOwner,
  readCrop,
} from "../services/chain-services/common-chain-service.js";
import * as producerChain from "../services/chain-services/producer-chain-service.js";
import * as processChain from "../services/chain-services/process-chain-service.js";
import * as transportChain from "../services/chain-services/transport-chain-service.js";
import * as retailerChain from "../services/chain-services/retailer-chain-service.js";
const router = express.Router();
const ccName1 = "crop";
const ccName2 = "producer";
const ccName3 = "process";
const ccName4 = "transport";
const ccName5 = "retailer";
const channelName = "mychannel";

router.get("/", (req, res) => {
  res.render("home/index.njk");
});

router.post("/", async (req, res) => {
  const cropId = req.body.cropId;
  const gateway = await getGateway();
  const network = gateway.getNetwork(channelName);
  const contract = network.getContract(ccName1);
  try {
    const result = await readCrop(contract, cropId);
    // console.log(results);
    res.redirect("/trace/" + cropId);
  } catch (err) {
    console.error(err);
    res.send("failed!");
  }
  await releaseGateway(gateway);
});

router.get("/signup", (req, res) => {
  res.render("home/signup.njk", { messages: req.session.messages });
});

router.post("/signup", async (req, res) => {
  const db = await connection();
  var [result, _] = await db.query("SELECT * FROM user WHERE username = ?", [
    req.body.username,
  ]);
  db.release();
  if (!result.length) {
    const sql =
      "INSERT INTO user (username, password, organization) VALUES(?, ?, ?)";
    try {
      result = await db.query(sql, [
        req.body.username,
        req.body.password,
        req.body.organization,
      ]);
    } catch (err) {
      db.release();
      res.redirect("/signup");
    }
    console.log(req.body);
    // 释放连接！！！
    db.release();
    res.redirect("/login");
  } else {
    db.release();
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("home/login.njk", {
    messages: req.session.messages,
    initValue: req.session.loginFormValue || { username: "", password: "" },
  });
  req.session.messages = [];
});

// 用户登陆
router.post(
  "/login",
  (req, res, next) => {
    req.session.loginFormValue = {
      username: req.body.username,
      password: req.body.password,
    };
    next();
  },
  passport.authenticate("local", {
    successReturnToOrRedirect: "/dashboard",
    failureRedirect: "/login",
    failureMessage: true,
  })
);

router.post("/logout", function (req, res) {
  req.logOut();
  res.redirect("/");
});

router.get("/trace/:cropId", async (req, res) => {
  const gateway = await getGateway();
  const network = gateway.getNetwork(channelName);
  const cropId = req.params.cropId;
  const contract = network.getContract(ccName1);
  try {
    const result = await readCrop(contract, cropId);
    console.log(result);
    res.render("customer/addcrop.njk", {
      cropId: cropId,
      result: result,
      status: "disabled",
      target: "home",
    });
  } catch (err) {
    console.error(err);
    res.send("failed!");
  }
  await releaseGateway(gateway);
});

router.get("/trace/:cropId/growInfo", async (req, res) => {
  const gateway = await getGateway();
  const network = gateway.getNetwork(channelName);
  const cropId = req.params.cropId;
  const contract = network.getContract(ccName2);
  try {
    const result = await producerChain.queryByCrop(contract, cropId);
    console.log(result);
    res.render("customer/addgrow.njk", {
      cropId: cropId,
      result: result[0],
      status: "disabled",
      target: "growInfo",
    });
  } catch (err) {
    console.error(err);
    res.send("failed!");
  }
  await releaseGateway(gateway);
});

router.get("/trace/:cropId/machining", async (req, res) => {
  const gateway = await getGateway();
  const network = gateway.getNetwork(channelName);
  const cropId = req.params.cropId;
  const contract = network.getContract(ccName3);
  try {
    const result = await processChain.queryByCrop(contract, cropId);
    console.log(result);
    res.render("customer/addmachining.njk", {
      cropId: cropId,
      result: result[0],
      status: "disabled",
      target: "machining",
    });
  } catch (err) {
    console.error(err);
    res.send("failed!");
  }
  await releaseGateway(gateway);
});

router.get("/trace/:cropId/cargo1", async (req, res) => {
  const gateway = await getGateway();
  const network = gateway.getNetwork(channelName);
  const cropId = req.params.cropId;
  const contract = network.getContract(ccName4);
  try {
    const results = await transportChain.queryByCrop(contract, cropId);
    console.log(results);
    res.render("customer/addcargo.njk", {
      cropId: cropId,
      result: results[1],
      status: "disabled",
      target: "cargo1",
    });
  } catch (err) {
    console.error(err);
    res.send("failed!");
  }
  await releaseGateway(gateway);
});

router.get("/trace/:cropId/cargo2", async (req, res) => {
  const gateway = await getGateway();
  const network = gateway.getNetwork(channelName);
  const cropId = req.params.cropId;
  const contract = network.getContract(ccName4);
  try {
    const results = await transportChain.queryByCrop(contract, cropId);
    console.log(results);
    res.render("customer/addcargo.njk", {
      cropId: cropId,
      result: results[0],
      status: "disabled",
      target: "cargo2",
    });
  } catch (err) {
    console.error(err);
    res.send("failed!");
  }
  await releaseGateway(gateway);
});

router.get("/trace/:cropId/product", async (req, res) => {
  const gateway = await getGateway();
  const network = gateway.getNetwork(channelName);
  const cropId = req.params.cropId;
  const contract = network.getContract(ccName5);
  try {
    const result = await retailerChain.queryByCrop(contract, cropId);
    console.log(result);
    res.render("customer/addproduct.njk", {
      cropId: cropId,
      result: result[0],
      status: "disabled",
      target: "product",
    });
  } catch (err) {
    console.error(err);
    res.send("failed!");
  }
  await releaseGateway(gateway);
});

router.get("/trace/:cropId/cert", async (req, res) => {
  const cropId = req.params.cropId;

  const gateway = await getGateway();
  const network = gateway.getNetwork(channelName);
  const contract1 = network.getContract(ccName1);
  const contract2 = network.getContract(ccName2);
  const contract3 = network.getContract(ccName3);
  const contract4 = network.getContract(ccName4);
  const contract5 = network.getContract(ccName5);

  try {
    const hash = await retailerChain.generateHash(
      contract1,
      contract2,
      contract3,
      contract4,
      contract5,
      cropId
    );
    res.render("customer/chaincert.njk", {
      cropId: cropId,
      hash: hash,
      target: "cert",
    });
  } catch (err) {
    console.log(err);
    res.render("customer/chaincert.njk");
  }

  await releaseGateway(gateway);
});
export default router;
