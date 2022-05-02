package Info

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// TransportContract provides functions for managing an Asset
type TransportContract struct {
	contractapi.Contract
}

type Cargo struct {
	//货物号
	CargoID string `json:"cargo_id"`
	//货物ID
	CropID string `json:"crop_id"`
	//服务商ID
	ServerID string `json:"server_id"`
	//服务商名称
	ServerName string `json:"server_name"`
	//司机ID
	DriverID string `json:"driver_id"`
	//司机名字
	DriverName string `json:"driver_name"`
	//物流信息上链时间
	OnchainTime string `json:"on_chain_time"`
	//物流当前地址
	CurrentAddress string `json:"current_address"`
	//物流目的地
	Destination string `json:"destination"`
	//备注（始发地，途中，目的地）
	Remarks string `json:"remarks"`
}

func (s *TransportContract) RecordCargo(ctx contractapi.TransactionContextInterface, cargoID string, cropID string, serverID string, serverName string, driverID string, driverName string, onchainTime string, currentAddress string, destination string, remarks string) error {
	exists, err := s.CargoExists(ctx, cargoID)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the record %s already have", cargoID)
	}

	cargo := Cargo{
		CargoID:        cargoID,
		CropID:         cropID,
		ServerID:       serverID,
		ServerName:     serverName,
		DriverID:       driverID,
		DriverName:     driverName,
		OnchainTime:    onchainTime,
		CurrentAddress: currentAddress,
		Destination:    destination,
		Remarks:        remarks,
	}
	transportJSON, err := json.Marshal(cargo)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(cargoID, transportJSON)
}

func (s *TransportContract) UpdateCargo(ctx contractapi.TransactionContextInterface, cargoID string, cropID string, serverID string, serverName string, driverID string, driverName string, onchainTime string, currentAddress string, destination string, remarks string) error {
	cargo, err := s.ReadByCargo(ctx, cargoID)
	if err != nil {
		return err
	}
	// overwriting original food with new info
	cargo.CargoID = cargoID
	cargo.CropID = cropID
	cargo.ServerID = serverID
	cargo.ServerName = serverName
	cargo.DriverID = driverID
	cargo.DriverName = driverName
	cargo.OnchainTime = onchainTime
	cargo.CurrentAddress = currentAddress
	cargo.Destination = destination
	cargo.Remarks = remarks

	transportJSON, err := json.Marshal(cargoID)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(cargoID, transportJSON)
}

func (s *TransportContract) ReadByCargo(ctx contractapi.TransactionContextInterface, cargoID string) (*Cargo, error) {
	transportJSON, err := ctx.GetStub().GetState(cargoID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if transportJSON == nil {
		return nil, fmt.Errorf("the Cargo ID %s does not exist", cargoID)
	}

	var cargo Cargo
	err = json.Unmarshal(transportJSON, &cargo)
	if err != nil {
		return nil, err
	}
	return &cargo, nil
}

// Check if the cargoID is exist
func (s *TransportContract) CargoExists(ctx contractapi.TransactionContextInterface, cargoID string) (bool, error) {
	transportJSON, err := ctx.GetStub().GetState(cargoID)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}
	return transportJSON != nil, nil
}

// Get all Cargos from the world state
func (s *TransportContract) QueryAllCargos(ctx contractapi.TransactionContextInterface) ([]*Cargo, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var cargos []*Cargo
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var cargo Cargo
		err = json.Unmarshal(queryResponse.Value, &cargo)
		if err != nil {
			return nil, err
		}
		cargos = append(cargos, &cargo)
	}
	return cargos, err
}

//Get the cargo order according to the given cropID
func (s *TransportContract) QueryByCrop(ctx contractapi.TransactionContextInterface, cropID string) ([]*Cargo, error) {
	queryString := fmt.Sprintf("{\"selector\":{\"crop_id\":{\"$eq\":\"%s\"}}}", cropID)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	defer resultsIterator.Close()

	var cargos []*Cargo
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var cargo Cargo
		err = json.Unmarshal(queryResponse.Value, &cargo)
		if err != nil {
			return nil, err
		}
		cargos = append(cargos, &cargo)
	}
	return cargos, err
}

//Get the cargo order according to the given serverID
func (s *TransportContract) QueryByServerId(ctx contractapi.TransactionContextInterface, serverID string) ([]*Cargo, error) {
	queryString := fmt.Sprintf("{\"selector\":{\"server_id\":{\"$eq\":\"%s\"}}}", serverID)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	defer resultsIterator.Close()

	var cargos []*Cargo
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var cargo Cargo
		err = json.Unmarshal(queryResponse.Value, &cargo)
		if err != nil {
			return nil, err
		}
		cargos = append(cargos, &cargo)
	}
	return cargos, err
}
