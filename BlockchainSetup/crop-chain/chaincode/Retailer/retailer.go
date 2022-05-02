package main

import (
	"Retailer/Info"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"log"
)

func main() {
	retailerChaincode, err := contractapi.NewChaincode(&Info.RetailerContract{})
	if err != nil {
		log.Panicf("Error creating retailer chaincode: %v", err)
	}

	if err := retailerChaincode.Start(); err != nil {
		log.Panicf("Error starting retailer chaincode: %v", err)
	}
}
