package main

import (
	"Process/Info"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"log"
)

func main() {
	processChaincode, err := contractapi.NewChaincode(&Info.ProcessContract{})
	if err != nil {
		log.Panicf("Error creating process chaincode: %v", err)
	}

	if err := processChaincode.Start(); err != nil {
		log.Panicf("Error starting process chaincode: %v", err)
	}
}
