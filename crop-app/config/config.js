import path, { dirname, basename } from "path";
import { fileURLToPath } from "url";

const PATH = path.join(dirname(fileURLToPath(import.meta.url)), "..");

export default {
  port: 8000,
  db: {
    user: "root",
    password: "public",
    host: "127.0.0.1",
    port: 3306,
    database: "crop",
  },
  sessionSecret: "ee4ae84f-9198-47c9-bbb4-3b77559e2a5f",
  upload: {
    dest: path.join(PATH, "uploads"),
  },
  gateway: {
    // This four params should change according to the role's organization!
    cryptoPath:
      "../BlockchainSetup//crop-chain/organizations/peerOrganizations/org1.trace.com",
    peerEndpoint: "localhost:7051",
    peerName: "peer0.org1.trace.com",
    userName: "User1@org1.trace.com",
    mspId: "Org1MSP",
  },
  // For process:
  // cryptoPath: '../BlockchainSetup//crop-chain/organizations/peerOrganizations/org2.trace.com',
  // peerEndpoint: 'localhost:8051',
  // peerName: 'peer0.org2.trace.com',
  // userName: 'User1@org2.trace.com',
};
