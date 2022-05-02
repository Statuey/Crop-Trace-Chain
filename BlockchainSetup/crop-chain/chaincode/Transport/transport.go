package main

import (
	"Transport/Info"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"log"
)

func main() {
	transportChaincode, err := contractapi.NewChaincode(&Info.TransportContract{})
	if err != nil {
		log.Panicf("Error creating transport chaincode: %v", err)
	}

	if err := transportChaincode.Start(); err != nil {
		log.Panicf("Error starting transport chaincode: %v", err)
	}
}
