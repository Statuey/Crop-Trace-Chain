package Info

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// ProcessContract provides functions for managing an Asset
type ProcessContract struct {
	contractapi.Contract
}

//食品加工信息
type Machining struct {
	//加工ID 加工信息溯源标识
	MachiningID string `json:"machining_id"`
	//货物ID
	CropID string `json:"crop_id"`
	//厂商ID
	FactoryID string `json:"factory_id"`
	//厂商名称
	FactoryName string `json:"factory_name"`
	//加工车间号
	WorkshopID string `json:"workshop_id"`
	//加工车间名
	WorkshopName string `json:"workshop_name"`
	//检测结果
	TestingResult string `json:"testing_result"`
	//入库时间
	InFactoryTime string `json:"in_factory_time"`
	//出库时间
	OutFactoryTime string `json:"out_factory_time"`
	//质检过程图片
	TestingPhotoUrl string `json:"testing_photo_url"`
	//备注
	Remarks string `json:"remarks"`
}

func (s *ProcessContract) RecordMachining(ctx contractapi.TransactionContextInterface, machiningID string, cropID string, factoryID string, factoryName string, workshopID string, workshopName string, testingResult string, inFactoryTime string, outFactoryTime string, testingPhotoUrl string, remarks string) error {
	exists, err := s.MachiningExists(ctx, machiningID)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the record %s already have", machiningID)
	}

	machining := Machining{
		MachiningID:     machiningID,
		CropID:          cropID,
		FactoryID:       factoryID,
		FactoryName:     factoryName,
		WorkshopID:      workshopID,
		WorkshopName:    workshopName,
		TestingResult:   testingResult,
		InFactoryTime:   inFactoryTime,
		OutFactoryTime:  outFactoryTime,
		TestingPhotoUrl: testingPhotoUrl,
		Remarks:         remarks,
	}
	processJSON, err := json.Marshal(machining)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(machiningID, processJSON)
}

func (s *ProcessContract) UpdateMachining(ctx contractapi.TransactionContextInterface, machiningID string, cropID string, factoryID string, factoryName string, workshopID string, workshopName string, testingResult string, inFactoryTime string, outFactoryTime string, testingPhotoUrl string, remarks string) error {
	machining, err := s.ReadByMachining(ctx, machiningID)
	if err != nil {
		return err
	}
	// overwriting original food with new info
	machining.MachiningID = machiningID
	machining.CropID = cropID
	machining.FactoryID = factoryID
	machining.FactoryName = factoryName
	machining.WorkshopID = workshopID
	machining.WorkshopName = workshopName
	machining.TestingResult = testingResult
	machining.InFactoryTime = inFactoryTime
	machining.OutFactoryTime = outFactoryTime
	machining.TestingPhotoUrl = testingPhotoUrl
	machining.Remarks = remarks

	processJSON, err := json.Marshal(machiningID)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(machiningID, processJSON)
}

//根据Machining号获取订单
func (s *ProcessContract) ReadByMachining(ctx contractapi.TransactionContextInterface, machiningID string) (*Machining, error) {
	processJSON, err := ctx.GetStub().GetState(machiningID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if processJSON == nil {
		return nil, fmt.Errorf("the Machining ID %s does not exist", machiningID)
	}

	var machining Machining
	err = json.Unmarshal(processJSON, &machining)
	if err != nil {
		return nil, err
	}

	return &machining, nil
}

// Check if the machineID is exist
func (s *ProcessContract) MachiningExists(ctx contractapi.TransactionContextInterface, machiningID string) (bool, error) {
	processJSON, err := ctx.GetStub().GetState(machiningID)
	if err != nil { // Check if the farm is exist
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}
	return processJSON != nil, nil
}

// Get all Machine from the world state
func (s *ProcessContract) QueryAllMachinings(ctx contractapi.TransactionContextInterface) ([]*Machining, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var machinings []*Machining
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var machining Machining
		err = json.Unmarshal(queryResponse.Value, &machining)
		if err != nil {
			return nil, err
		}
		machinings = append(machinings, &machining)
	}
	return machinings, err
}

func (s *ProcessContract) QueryByCrop(ctx contractapi.TransactionContextInterface, cropID string) ([]*Machining, error) {
	queryString := fmt.Sprintf("{\"selector\":{\"crop_id\":{\"$eq\":\"%s\"}}}", cropID)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	defer resultsIterator.Close()

	var machinings []*Machining
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var machining Machining
		err = json.Unmarshal(queryResponse.Value, &machining)
		if err != nil {
			return nil, err
		}
		machinings = append(machinings, &machining)
	}
	return machinings, err

}

func (s *ProcessContract) QueryByFactoryId(ctx contractapi.TransactionContextInterface, factoryID string) ([]*Machining, error) {
	queryString := fmt.Sprintf("{\"selector\":{\"factory_id\":{\"$eq\":\"%s\"}}}", factoryID)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	defer resultsIterator.Close()

	var machinings []*Machining
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var machining Machining
		err = json.Unmarshal(queryResponse.Value, &machining)
		if err != nil {
			return nil, err
		}
		machinings = append(machinings, &machining)
	}
	return machinings, err

}
