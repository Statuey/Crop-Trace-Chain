package main

import (
	"Producer/Info"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"log"
)

func main() {
	producerChaincode, err := contractapi.NewChaincode(&Info.ProducerContract{})
	if err != nil {
		log.Panicf("Error creating producer chaincode: %v", err)
	}

	if err := producerChaincode.Start(); err != nil {
		log.Panicf("Error starting producer chaincode: %v", err)
	}
}
