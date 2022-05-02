import config from "./config.js";
import { signers, connect } from "@hyperledger/fabric-gateway";
import genericPool from "generic-pool";
import * as grpc from "@grpc/grpc-js";
import * as fs from "fs/promises";
import * as path from "path";
import * as crypto from "crypto";

async function newGrpcConnection() {
  const tlsCertPath = path.resolve(
    config.gateway.cryptoPath,
    "peers",
    config.gateway.peerName,
    "tls",
    "ca.crt"
  );
  const tlsRootCert = await fs.readFile(tlsCertPath);
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
  return new grpc.Client(config.gateway.peerEndpoint, tlsCredentials, {
    "grpc.ssl_target_name_override": config.gateway.peerName,
  });
}

async function newIdentity() {
  // Path to user certificate.
  const mspId = config.gateway.mspId;
  const certPath = path.resolve(
    config.gateway.cryptoPath,
    "users",
    config.gateway.userName,
    "msp",
    "signcerts",
    "cert.pem"
  );
  const credentials = await fs.readFile(certPath);
  return { mspId, credentials };
}

async function newSigner() {
  // Path to user private key directory.
  const keyDirectoryPath = path.resolve(
    config.gateway.cryptoPath,
    "users",
    config.gateway.userName,
    "msp",
    "keystore"
  );
  const files = await fs.readdir(keyDirectoryPath);
  const keyPath = path.resolve(keyDirectoryPath, files[0]);
  const privateKeyPem = await fs.readFile(keyPath);
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  return signers.newPrivateKeySigner(privateKey);
}

const factory = {
  create: async () => {
    const connection = await newGrpcConnection();
    const gatewayClient = connect({
      client: connection,
      identity: await newIdentity(),
      signer: await newSigner(),
      evaluateOptions: () => {
        return { deadline: Date.now() + 5000 };
      },
      endorseOptions: () => {
        return { deadline: Date.now() + 15000 };
      },
      submitOptions: () => {
        return { deadline: Date.now() + 5000 };
      },
      commitStatusOptions: () => {
        return { deadline: Date.now() + 6000 };
      },
    });
    gatewayClient.grpcConnection = connection;
    return gatewayClient;
  },
  destroy: (client) => {
    client.close();
    client.grpcConnection.close();
  },
};

const pool = genericPool.createPool(factory, {
  max: 10,
  min: 2,
});

export default pool;
