import express from "express";
import { getGateway, releaseGateway } from "../../helpers/gateway-helper.js";
import { connection } from "../../helpers/db-helper.js";
import {
  createCrop,
  readInfo,
  queryByCrop,
  queryAllInfos,
  updateCrop,
  recordInfo,
} from "../services/chain-services/producer-chain-service.js";
import {
  queryAllMachinings,
  readMachining,
  recordMachining,
} from "../services/chain-services/process-chain-service.js";
import {
  queryAllCargos,
  readCargo,
  recordCargo,
} from "../services/chain-services/transport-chain-service.js";
import {
  generateHash,
  queryAllProducts,
  readProduct,
  recordProduct,
} from "../services/chain-services/retailer-chain-service.js";
import {
  transactionCrop,
  queryByOwner,
  readCrop,
} from "../services/chain-services/common-chain-service.js";
import {
  getFarmName,
  getFarmDetails,
  getFarmerDetails,
  getFarmers,
  getPlantId,
  getPlants,
  getFarmerId,
  getFarms,
} from "../services/db-services/producer-db-service.js";
import {
  getDriverDetails,
  getDriverId,
  getDrivers,
  getServerDetails,
  getServerName,
  getServers,
} from "../services/db-services/transport-db-service.js";
import {
  getFactoryDetails,
  getFactoryId,
  getFactoryName,
  getFactorys,
  getWorkshopDetails,
  getWorkshopId,
  getWorkshops,
} from "../services/db-services/process-db-service.js";
import {
  getRetailerDetails,
  getRetailerName,
  getRetailers,
  getTraderDetails,
  getTraderId,
  getTraders,
} from "../services/db-services/retailer-db-service.js";
import { genUuid } from "../services/db-services/common-db-service.js";
import upload from "../../config/upload.js";

const router = express.Router();
const ccName1 = "crop";
const ccName2 = "producer";
const ccName3 = "process";
const ccName4 = "transport";
const ccName5 = "retailer";
const channelName = "mychannel";

//主界面，显示该组织创建的订单
router.get("/", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const id = req.user.id;
    const gateway = await getGateway();
    const network = gateway.getNetwork(channelName);
    const key = String(id);
    if (org == "Producer") {
      const contract = network.getContract(ccName2);
      try {
        const results = await queryAllInfos(contract, key);
        res.render("producer/index.njk", { results: results, farmId: id });
      } catch (err) {
        // console.error(err);
        res.render("producer/index.njk", { farmId: id });
      }
    } else if (org == "Process") {
      const contract = network.getContract(ccName3);
      try {
        const results = await queryAllMachinings(contract, key);
        res.render("process/index.njk", { results: results, factoryId: id });
      } catch (err) {
        // console.error(err);
        res.render("process/index.njk", { factoryId: id });
      }
    } else if (org == "Transport") {
      const contract = network.getContract(ccName4);
      try {
        const results = await queryAllCargos(contract, key);
        res.render("transport/index.njk", { results: results, serverId: id });
      } catch (err) {
        console.log(err);
        res.render("transport/index.njk", { serverId: id });
      }
    } else if (org == "Retailer") {
      const contract = network.getContract(ccName5);
      try {
        const results = await queryAllProducts(contract, key);
        res.render("retailer/index.njk", { results: results, retailerId: id });
      } catch (err) {
        console.log(err);
        res.render("retailer/index.njk", { retailerId: id });
      }
    } else {
      contract = network.getContract(ccName1);
      res.send("admin dashboard");
    }
    await releaseGateway(gateway);
  } else {
    res.redirect("/login");
  }
});

//显示该组织详细信息
router.get("/infos", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const id = req.user.id;

    if (org == "Producer") {
      const result = await getFarmDetails(id);
      if (result) {
        res.render("producer/addinfo.njk", {
          result: result,
          status: "disabled",
        });
      } else {
        res.render("producer/addinfo.njk");
      }
    } else if (org == "Process") {
      const result = await getFactoryDetails(id);
      if (result) {
        res.render("process/addinfo.njk", {
          result: result,
          status: "disabled",
        });
      } else {
        res.render("process/addinfo.njk");
      }
    } else if (org == "Transport") {
      const result = await getServerDetails(id);
      if (result) {
        res.render("transport/addinfo.njk", {
          result: result,
          status: "disabled",
        });
      } else {
        res.render("transport/addinfo.njk");
      }
    } else if (org == "Retailer") {
      const result = await getRetailerDetails(id);
      if (result) {
        res.render("retailer/addinfo.njk", {
          result: result,
          status: "disabled",
        });
      } else {
        res.render("retailer/addinfo.njk");
      }
    } else {
    }
  } else {
    res.redirect("/login");
  }
});

//上传组织信息
router.post("/infos", upload.single("certificate"), async (req, res) => {
  const db = await connection();
  if (req.user) {
    const org = req.user.organization;
    const id = req.user.id;
    if (org == "Producer") {
      const sql =
        "INSERT INTO farm (farmId, farmName, foundTime, certificate, hc, address, bossName, bossTel) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
      var result = await db.query(sql, [
        req.user.id,
        req.body.farmname,
        req.body.foundtime,
        req.file.filename,
        req.body.hc,
        req.body.address,
        req.body.bossname,
        req.body.bosstel,
      ]);
      db.release();
      result = await getFarmDetails(id);
      res.render("producer/addinfo.njk", {
        status: "disabled",
        result: result,
      });
    } else if (org == "Process") {
      const sql =
        "INSERT INTO factory (factoryId, factoryName, foundTime, certificate, hc, address, bossName, bossTel) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
      var result = await db.query(sql, [
        req.user.id,
        req.body.factoryname,
        req.body.foundtime,
        req.file.filename,
        req.body.hc,
        req.body.address,
        req.body.bossname,
        req.body.bosstel,
      ]);
      db.release();
      result = await getFactoryDetails(id);
      res.render("process/addinfo.njk", {
        status: "disabled",
        result: result,
      });
    } else if (org == "Transport") {
      const sql =
        "INSERT INTO server (serverId, serverName, foundTime, certificate, hc, address, bossName, bossTel) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
      var result = await db.query(sql, [
        req.user.id,
        req.body.servername,
        req.body.foundtime,
        req.file.filename,
        req.body.hc,
        req.body.address,
        req.body.bossname,
        req.body.bosstel,
      ]);
      db.release();
      result = await getServerDetails(id);
      res.render("transport/addinfo.njk", {
        status: "disabled",
        result: result,
      });
    } else if (org == "Retailer") {
      const sql =
        "INSERT INTO retailer (retailerId, retailerName, foundTime, certificate, hc, address, bossName, bossTel) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
      var result = await db.query(sql, [
        req.user.id,
        req.body.retailername,
        req.body.foundtime,
        req.file.filename,
        req.body.hc,
        req.body.address,
        req.body.bossname,
        req.body.bosstel,
      ]);
      db.release();
      result = await getRetailerDetails(id);
      res.render("retailer/addinfo.njk", {
        status: "disabled",
        result: result,
      });
    } else {
    }
  } else {
    res.redirect("/login");
  }
});

//1.显示已经创建Crop但未创建Growinfo的作物 2.显示已经创建Crop和Growinfo但还未发往下一级的订单
router.get("/pending", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const id = req.user.id;
    const gateway = await getGateway();
    const network = gateway.getNetwork(channelName);
    if (org == "Producer") {
      var contract = network.getContract(ccName1);
      const farmName = await getFarmName(id);
      try {
        //Get the whole collection
        var collections = await queryByOwner(contract, farmName);
        if (!collections.length) {
          res.render("producer/pending.njk");
        } else {
          // console.log(collections);
          contract = network.getContract(ccName2);
          var sets1 = []; //case1
          var sets2 = []; //case2
          for (var i = 0; i < collections.length; i++) {
            var key = collections[i].crop_id;
            try {
              var temp = await queryByCrop(contract, key);
              // console.log(temp[0]);
              sets1.push(temp[0]);
            } catch (err) {
              sets2.push(collections[i]);
            }
          }
          res.render("producer/pending.njk", {
            sets1: sets1,
            sets2: sets2,
            farmId: id,
          });
        }
      } catch (err) {
        res.render("producer/pending.njk");
      }
    } else if (org == "Process") {
      var contract = network.getContract(ccName1);
      const factoryName = await getFactoryName(id);
      try {
        //Get the whole collection
        var collections = await queryByOwner(contract, factoryName);
        if (!collections.length) {
          res.render("process/pending.njk");
        } else {
          // console.log(collections);
          contract = network.getContract(ccName3);
          var sets1 = []; //case1
          var sets2 = []; //case2
          for (var i = 0; i < collections.length; i++) {
            var key = collections[i].crop_id;
            try {
              var temp = await queryByCrop(contract, key);
              // console.log(temp[0]);
              sets1.push(temp[0]);
            } catch (err) {
              sets2.push(collections[i]);
            }
          }
          res.render("process/pending.njk", {
            sets1: sets1,
            sets2: sets2,
            serverId: id,
          });
        }
      } catch (err) {
        res.render("process/pending.njk");
      }
    } else if (org == "Transport") {
      var contract = network.getContract(ccName1);
      const serverName = await getServerName(id);
      try {
        //Get the whole collection
        var collections = await queryByOwner(contract, serverName);
        if (!collections.length) {
          res.render("transport/pending.njk");
        } else {
          // console.log(collections);
          contract = network.getContract(ccName4);
          var sets1 = []; //case1
          var sets2 = []; //case2
          for (var i = 0; i < collections.length; i++) {
            var key = collections[i].crop_id;
            try {
              var temp = await queryByCrop(contract, key);
              if (temp.length == 1) {
                console.log(temp.length);
                sets2.push(collections[i]);
              } else if (temp.length == 2) {
                sets1.push(temp[0]);
              }
            } catch (err) {
              sets2.push(collections[i]);
            }
          }
          res.render("transport/pending.njk", {
            sets1: sets1,
            sets2: sets2,
            serverId: id,
          });
        }
      } catch (err) {
        res.render("transport/pending.njk");
      }
    } else if (org == "Retailer") {
      var contract = network.getContract(ccName1);
      const retailerName = await getRetailerName(id);
      try {
        //Get the whole collection
        var collections = await queryByOwner(contract, retailerName);
        if (!collections.length) {
          res.render("retailer/pending.njk");
        } else {
          // console.log(collections);
          contract = network.getContract(ccName5);
          var sets1 = []; //case1
          var sets2 = []; //case2
          for (var i = 0; i < collections.length; i++) {
            var key = collections[i].crop_id;
            try {
              var temp = await queryByCrop(contract, key);
              // console.log(temp[0]);
              sets1.push(temp[0]);
            } catch (err) {
              sets2.push(collections[i]);
            }
          }
          res.render("retailer/pending.njk", {
            sets1: sets1,
            sets2: sets2,
            serverId: id,
          });
        }
      } catch (err) {
        res.render("retailer/pending.njk");
      }
    }
    await releaseGateway(gateway);
  } else {
    res.redirect("/login");
  }
});

//显示交易界面
router.get("/pending/:id/transaction", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const cropId = req.params.id;
    const id = req.user.id;
    if (org == "Producer") {
      const orgs = await getServers();
      console.log(orgs);
      res.render("public/transaction.njk", { orgs });
    } else if (org == "Process") {
      const orgs = await getServers();
      console.log(orgs);
      res.render("public/transaction.njk", { orgs });
    } else if (org == "Transport") {
      const gateway = await getGateway();
      const network = gateway.getNetwork(channelName);
      const contract = network.getContract(ccName1);
      try {
        const result = await readCrop(contract, cropId);
        let orgs;
        if (result.current_phase == 1) {
          orgs = await getFactorys();
        } else if (result.current_phase == 3) {
          orgs = await getRetailers();
        }
        res.render("public/transaction.njk", { orgs });
      } catch (err) {
        res.render("public/transaction.njk");
      }
      await releaseGateway(gateway);
    } else if (org == "Retailer") {
      res.render("public/transaction.njk");
    }
  } else {
    res.redirect("/login");
  }
});

//发起交易，将crop订单发送给下一级
router.post("/pending/:id/transaction", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const gateway = await getGateway();
    const network = gateway.getNetwork(channelName);
    const contract = network.getContract(ccName1);
    const cropId = req.params.id;
    if (org == "Producer") {
      const newOwner = req.body.newOwner;
      const newPhase = "1";
      try {
        await transactionCrop(contract, cropId, newPhase, newOwner);
        res.render("producer/general/success.njk");
      } catch (err) {
        res.render("producer/general/fail.njk", { des: "crop" });
      }
    } else if (org == "Process") {
      const newOwner = req.body.newOwner;
      const newPhase = "3";
      try {
        await transactionCrop(contract, cropId, newPhase, newOwner);
        res.render("process/general/success.njk");
      } catch (err) {
        res.render("process/general/fail.njk", { des: "crop" });
      }
    } else if (org == "Transport") {
      const newOwner = req.body.newOwner;
      let newPhase;
      if (getFactoryId(newOwner) != null) {
        newPhase = "2";
      } else {
        newPhase = "4";
      }
      try {
        await transactionCrop(contract, cropId, newPhase, newOwner);
        res.render("transport/general/success.njk");
      } catch (err) {
        res.render("transport/general/fail.njk", { des: "crop" });
      }
    } else if (org == "Retailer") {
      const newOwner = req.body.newOwner;
      const newPhase = "5";
      try {
        await transactionCrop(contract, cropId, newPhase, newOwner);
        res.render("retailer/general/success.njk");
      } catch (err) {
        res.render("retailer/general/fail.njk", { des: "crop" });
      }
    }
    await releaseGateway(gateway);
  } else {
    res.redirect("/login");
  }
});

//显示所有员工或设备信息摘要
router.get("/members", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const id = req.user.id;
    if (org == "Producer") {
      const results = await getFarmers(id);
      // console.log(results);
      res.render("producer/farmers.njk", { id, results: results });
    } else if (org == "Process") {
      const results = await getWorkshops(id);
      console.log(results);
      res.render("process/workshops.njk", { id, results: results });
    } else if (org == "Transport") {
      const results = await getDrivers(id);
      // console.log(results);
      res.render("transport/drivers.njk", { id, results: results });
    } else if (org == "Retailer") {
      const results = await getTraders(id);
      // console.log(results);
      res.render("retailer/traders.njk", { id, results: results });
    } else {
    }
  } else {
    res.redirect("/login");
  }
});

//显示创建旗下员工档案界面
router.get("/create/member", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    if (org == "Producer") {
      res.render("producer/addfarmer.njk");
    } else if (org == "Process") {
      res.render("process/addworkshop.njk");
    } else if (org == "Transport") {
      res.render("transport/adddriver.njk");
    } else if (org == "Retailer") {
      res.render("retailer/addtrader.njk");
    }
  } else {
    res.redirect("/login");
  }
});

//提交创建新农户档案
router.post("/create/member", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const db = await connection();
    if (org == "Producer") {
      var [result, _] = await db.query(
        "SELECT * FROM farmers WHERE farmerName =?",
        [req.body.farmername]
      );
      db.release();
      if (!result.length) {
        const sql =
          "INSERT INTO farmers (farmerName,farmId,birthday,accessTime,gender,farmerTel) VALUES(?, ?, ?, ?, ?, ?)";
        try {
          [result, _] = await db.query(sql, [
            req.body.farmername,
            req.user.id,
            req.body.birthday,
            req.body.accesstime,
            req.body.gender,
            req.body.farmertel,
          ]);
          console.log(req.body);
          // 释放连接！！！
          db.release();
          res.render("producer/general/success.njk");
        } catch (err) {
          db.release();
          res.render("producer/general/fail.njk", { des: "farmer" });
        }
      } else {
        db.release();
        res.render("producer/general/fail.njk", { des: "farmer" });
      }
    } else if (org == "Process") {
      var [result, _] = await db.query(
        "SELECT * FROM workshops WHERE workshopName =?",
        [req.body.workshopname]
      );
      db.release();
      if (!result.length) {
        const sql =
          "INSERT INTO workshops (workshopName,factoryId,foundTime,leaderName,leaderTel) VALUES(?, ?, ?, ?, ?)";
        try {
          [result, _] = await db.query(sql, [
            req.body.workshopname,
            req.user.id,
            req.body.foundtime,
            req.body.leadername,
            req.body.leadertel,
          ]);
          console.log(req.body);
          // 释放连接！！！
          db.release();
          res.render("process/general/success.njk");
        } catch (err) {
          console.log(err);
          db.release();
          res.render("process/general/fail.njk", { des: "workshop" });
        }
      } else {
        db.release();
        res.render("process/general/fail.njk", { des: "workshop" });
      }
    } else if (org == "Transport") {
      var [result, _] = await db.query(
        "SELECT * FROM drivers WHERE driverName =?",
        [req.body.drivername]
      );
      db.release();
      if (!result.length) {
        const sql =
          "INSERT INTO drivers (driverName,serverId,birthday,accessTime,gender,driverTel) VALUES(?, ?, ?, ?, ?, ?)";
        try {
          [result, _] = await db.query(sql, [
            req.body.drivername,
            req.user.id,
            req.body.birthday,
            req.body.accesstime,
            req.body.gender,
            req.body.drivertel,
          ]);
          console.log(req.body);
          // 释放连接！！！
          db.release();
          res.render("transport/general/success.njk");
        } catch (err) {
          db.release();
          res.render("transport/general/fail.njk", { des: "driver" });
        }
      } else {
        db.release();
        res.render("transport/general/fail.njk", { des: "driver" });
      }
    } else if (org == "Retailer") {
      var [result, _] = await db.query(
        "SELECT * FROM traders WHERE traderName =?",
        [req.body.tradername]
      );
      db.release();
      if (!result.length) {
        const sql =
          "INSERT INTO traders (traderName,retailerId,foundTime,leaderName,leaderTel) VALUES(?, ?, ?, ?, ?)";
        try {
          [result, _] = await db.query(sql, [
            req.body.tradername,
            req.user.id,
            req.body.foundtime,
            req.body.leadername,
            req.body.leadertel,
          ]);
          console.log(req.body);
          // 释放连接！！！
          db.release();
          res.render("retailer/general/success.njk");
        } catch (err) {
          console.log(err);
          db.release();
          res.render("retailer/general/fail.njk", { des: "trader" });
        }
      } else {
        db.release();
        res.render("retailer/general/fail.njk", { des: "trader" });
      }
    }
  } else {
    res.redirect("/login");
  }
});

//显示单个用户详细信息
router.get("/member/:id", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const id = req.user.id;
    if (org == "Producer") {
      const farmerId = req.params.id;
      const result = await getFarmerDetails(farmerId);
      res.render("producer/addfarmer.njk", {
        result: result,
        status: "disabled",
      });
    } else if (org == "Process") {
      const workshopId = req.params.id;
      const result = await getWorkshopDetails(workshopId);
      res.render("process/addworkshop.njk", {
        result: result,
        status: "disabled",
      });
    } else if (org == "Transport") {
      const driverId = req.params.id;
      const result = await getDriverDetails(driverId);
      res.render("transport/adddriver.njk", {
        result: result,
        status: "disabled",
      });
    } else if (org == "Retailer") {
      const traderId = req.params.id;
      const result = await getTraderDetails(traderId);
      res.render("retailer/addtrader.njk", {
        result: result,
        status: "disabled",
      });
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/tochain", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const id = req.user.id;

    if (org == "Retailer") {
      const gateway = await getGateway();
      const network = gateway.getNetwork(channelName);
      const contract1 = network.getContract(ccName1);
      const contract2 = network.getContract(ccName2);
      const contract3 = network.getContract(ccName3);
      const contract4 = network.getContract(ccName4);
      const contract5 = network.getContract(ccName5);

      try {
        const results = await queryByOwner(contract1, "Finished");
        console.log(results);
        res.render("retailer/readylist.njk", { results: results });
      } catch (err) {
        console.log(err);
        res.render("retailer/readylist.njk");
      }
      await releaseGateway(gateway);
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/tochain/:cropId", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const id = req.user.id;
    const cropId = req.params.cropId;

    if (org == "Retailer") {
      const gateway = await getGateway();
      const network = gateway.getNetwork(channelName);
      const contract1 = network.getContract(ccName1);
      const contract2 = network.getContract(ccName2);
      const contract3 = network.getContract(ccName3);
      const contract4 = network.getContract(ccName4);
      const contract5 = network.getContract(ccName5);

      try {
        const hash = await generateHash(
          contract1,
          contract2,
          contract3,
          contract4,
          contract5,
          cropId
        );
        res.render("retailer/uploadcrop.njk", {
          cropId: cropId,
          hash: hash,
        });
      } catch (err) {
        console.log(err);
        res.render("retailer/uploadcrop.njk");
      }
      await releaseGateway(gateway);
    }
  } else {
    res.redirect("/login");
  }
});

router.post("/tochain/:cropId", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const cropId = req.params.cropId;
    if (org == "Retailer") {
      const newOwner = "Finished";
      const newPhase = "6";
      const gateway = await getGateway();
      const network = gateway.getNetwork(channelName);
      const contract = network.getContract(ccName1);
      try {
        await transactionCrop(contract, cropId, newPhase, newOwner);
        res.render("producer/general/success.njk");
      } catch (err) {
        res.render("producer/general/fail.njk", { des: "crop" });
      }
      await releaseGateway(gateway);
    }
  } else {
    res.redirect("/login");
  }
});

//显示单个订单
router.get("/:detailid", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const gateway = await getGateway();
    const network = gateway.getNetwork(channelName);
    if (org == "Producer") {
      const growId = req.params.detailid;
      const contract = network.getContract(ccName2);
      try {
        const result = await readInfo(contract, growId);
        console.log(result);
        res.render("producer/addgrow.njk", {
          result: result,
          status: "disabled",
        });
      } catch (err) {
        console.error(err);
        res.send("failed!");
      }
    } else if (org == "Process") {
      const machiningId = req.params.detailid;
      const contract = network.getContract(ccName3);
      try {
        const result = await readMachining(contract, machiningId);
        console.log(result);
        res.render("process/addmachining.njk", {
          result: result,
          status: "disabled",
        });
      } catch (err) {
        console.error(err);
        res.send("failed!");
      }
    } else if (org == "Transport") {
      const cargoId = req.params.detailid;
      const contract = network.getContract(ccName4);
      try {
        const result = await readCargo(contract, cargoId);
        console.log(result);
        res.render("transport/addcargo.njk", {
          result: result,
          status: "disabled",
        });
      } catch (err) {
        console.error(err);
        res.send("failed!");
      }
    } else if (org == "Retailer") {
      const productId = req.params.detailid;
      const contract = network.getContract(ccName5);
      try {
        const result = await readProduct(contract, productId);
        console.log(result);
        res.render("retailer/addproduct.njk", {
          result: result,
          status: "disabled",
        });
      } catch (err) {
        console.error(err);
        res.send("failed!");
      }
    }
    await releaseGateway(gateway);
  } else {
    res.redirect("/login");
  }
});

//更新单个订单
//还没有做！！
router.get("/:detailid/update", async (req, res) => {
  const farmId = req.params.farmId;
  const gateway = await getGateway();
  const growId = req.params.growId;
  const network = gateway.getNetwork(channelName);
  const contract = network.getContract(ccName2);
  try {
    const result = await readInfo(contract, growId);
    // console.log(result);
    res.render("producer/addcrop.njk", { result: result, farmId: farmId });
  } catch (err) {
    console.error(err);
    res.send("failed!");
  }
});

//显示单个作物订单
router.get("/crops/:cropId", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const id = req.user.id;
    const gateway = await getGateway();
    const network = gateway.getNetwork(channelName);
    const cropId = req.params.cropId;
    const contract = network.getContract(ccName1);
    try {
      const result = await readCrop(contract, cropId);
      console.log(result);
      if (org == "Producer") {
        res.render("producer/addcrop.njk", {
          result: result,
          status: "disabled",
          farmId: id,
        });
      } else if (org == "Transport") {
        res.render("transport/addcrop.njk", {
          result: result,
          status: "disabled",
          farmId: id,
        });
      } else if (org == "Process") {
        res.render("process/addcrop.njk", {
          result: result,
          status: "disabled",
          farmId: id,
        });
      } else if (org == "Retailer") {
        res.render("retailer/addcrop.njk", {
          result: result,
          status: "disabled",
          farmId: id,
        });
      }
    } catch (err) {
      console.error(err);
      res.send("failed!");
    }
    await releaseGateway(gateway);
  } else {
    res.redirect("/login");
  }
});

//显示创建新订单界面
router.get("/create/crop", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const id = req.user.id;

    if (org == "Producer") {
      const plants = await getPlants();
      // console.log(plants);
      res.render("producer/addcrop.njk", { farmId: id, plants });
    } else if (org == "Process") {
    } else if (org == "Transport") {
    } else if (org == "Retailer") {
    } else {
    }
  } else {
    res.redirect("/login");
  }
});

//创建新的作物订单
router.post("/create/crop", async (req, res) => {
  var d = new Date();
  const num = await getPlantId(req.body.plantname);
  const crop_id = genUuid(8, 16);
  const plant_id = String(num);
  console.log(plant_id);
  const plant_name = req.body.plantname;
  const plant_date = req.body.plantdate;
  const harvest_date = req.body.harvestdate;
  const crop_weight = req.body.cropweight;
  const create_time = d.toLocaleDateString();
  const current_phase = "0";
  const current_owner = await getFarmName(req.user.id);
  const intro = req.body.intro;
  const remarks = req.body.remarks;
  const gateway = await getGateway();
  const network = gateway.getNetwork(channelName);
  const contract = network.getContract(ccName1);
  try {
    await createCrop(
      contract,
      crop_id,
      plant_id,
      plant_name,
      plant_date,
      harvest_date,
      crop_weight,
      create_time,
      current_phase,
      current_owner,
      intro,
      remarks
    );
    res.render("producer/general/success.njk");
  } catch (err) {
    console.error(err);
    res.render("producer/general/fail.njk", { des: crop_id });
  }
  await releaseGateway(gateway);
});

router.get("/create/:id", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const id = req.user.id;
    if (org == "Producer") {
      const farmers = await getFarmers(id);
      res.render("producer/addgrow.njk", { farmers: farmers });
    } else if (org == "Process") {
      const workshops = await getWorkshops(id);
      res.render("process/addmachining.njk", { workshops: workshops });
    } else if (org == "Transport") {
      const drivers = await getDrivers(id);
      res.render("transport/addcargo.njk", { drivers: drivers });
    } else if (org == "Retailer") {
      const traders = await getTraders(id);
      res.render("retailer/addproduct.njk", { traders: traders });
    } else {
    }
  } else {
    res.redirect("/login");
  }
});

//提交创建的表单
router.post("/create/:id", async (req, res) => {
  if (req.user) {
    const org = req.user.organization;
    const id = req.user.id;
    const crop_id = req.params.id;
    if (org == "Producer") {
      const num = await getFarmerId(req.body.farmername);
      try {
        var d = new Date();
        const grow_id = genUuid(8, 16);
        const farm_name = await getFarmName(id);
        const farm_id = String(id);
        const farmer_id = String(num);
        const farmer_name = req.body.farmername;
        const record_time = d.toLocaleDateString();
        const crop_grow_photo_url = req.body.cropgrowphotourl;
        const grow_status = req.body.growstatus;
        const fertilizer_name = req.body.fertilizername;
        const plat_mode = req.body.platmode;
        const illumination_status = req.body.illuminationstatus;
        const remarks = req.body.remarks;
        const gateway = await getGateway();
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(ccName2);
        await recordInfo(
          contract,
          grow_id,
          crop_id,
          farm_id,
          farm_name,
          farmer_id,
          farmer_name,
          record_time,
          crop_grow_photo_url,
          grow_status,
          fertilizer_name,
          plat_mode,
          illumination_status,
          remarks
        );
        res.render("producer/general/success.njk");
      } catch (err) {
        console.log(err);
        res.render("producer/general/fail.njk", { des: crop_id });
      }
    } else if (org == "Process") {
      const num = await getWorkshopId(req.body.workshopname);
      try {
        const machining_id = genUuid(8, 16);
        const factory_name = await getFactoryName(id);
        const factory_id = String(id);
        const workshop_id = String(num);
        const workshop_name = req.body.workshopname;
        const testing_result = req.body.testingresult;
        const in_factory_time = req.body.infactorytime;
        const out_factory_time = req.body.outfactorytime;
        const testing_photo_url = req.body.testingphotourl;
        const remarks = req.body.remarks;
        const gateway = await getGateway();
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(ccName3);
        await recordMachining(
          contract,
          machining_id,
          crop_id,
          factory_id,
          factory_name,
          workshop_id,
          workshop_name,
          testing_result,
          in_factory_time,
          out_factory_time,
          testing_photo_url,
          remarks
        );
        res.render("process/general/success.njk");
      } catch (err) {
        console.log(err);
        res.render("process/general/fail.njk", { des: crop_id });
      }
    } else if (org == "Transport") {
      const num = await getDriverId(req.body.drivername);
      try {
        var d = new Date();
        const cargo_id = genUuid(8, 16);
        const server_name = await getServerName(id);
        const server_id = String(id);
        const driver_id = String(num);
        const driver_name = req.body.drivername;
        const on_chain_time = d.toLocaleDateString();
        const current_address = req.body.currentaddress;
        const destination = req.body.destination;
        const remarks = req.body.remarks;
        const gateway = await getGateway();
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(ccName4);
        await recordCargo(
          contract,
          cargo_id,
          crop_id,
          server_id,
          server_name,
          driver_id,
          driver_name,
          on_chain_time,
          current_address,
          destination,
          remarks
        );
        res.render("transport/general/success.njk");
      } catch (err) {
        console.log(err);
        res.render("transport/general/fail.njk", { des: crop_id });
      }
    } else if (org == "Retailer") {
      const num = await getTraderId(req.body.tradername);
      try {
        const product_id = genUuid(8, 16);
        const retailer_name = await getRetailerName(id);
        const retailer_id = String(id);
        const trader_id = String(num);
        const trader_name = req.body.tradername;
        const retailer_cert_url = req.body.retailercerturl;
        const buyout_time = req.body.buyouttime;
        const remarks = req.body.remarks;
        const gateway = await getGateway();
        const network = gateway.getNetwork(channelName);
        const contract = network.getContract(ccName5);
        await recordProduct(
          contract,
          product_id,
          crop_id,
          retailer_id,
          retailer_name,
          trader_id,
          trader_name,
          retailer_cert_url,
          buyout_time,
          remarks
        );
        // console.log(
        //   product_id,
        //   crop_id,
        //   retailer_id,
        //   retailer_name,
        //   trader_id,
        //   trader_name,
        //   retailer_cert_url,
        //   buyout_time,
        //   remarks
        // );
        res.render("retailer/general/success.njk");
      } catch (err) {
        console.log(err);
        res.render("retailer/general/fail.njk", { des: crop_id });
      }
    }
    await releaseGateway(gateway);
  } else {
    res.redirect("/login");
  }
});

export default router;
