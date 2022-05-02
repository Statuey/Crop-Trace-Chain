package main

import (
	"Crop/Info"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"log"
)

func main() {
	smartChaincode, err := contractapi.NewChaincode(&Info.SmartContract{})
	if err != nil {
		log.Panicf("Error creating smart chaincode: %v", err)
	}

	if err := smartChaincode.Start(); err != nil {
		log.Panicf("Error starting smart chaincode: %v", err)
	}
}
