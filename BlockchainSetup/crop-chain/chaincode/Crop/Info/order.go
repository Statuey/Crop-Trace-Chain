package Info

//该智能合约部署在所有节点上
import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type SmartContract struct {
	contractapi.Contract
}

type Crop struct {
	//作物ID，用作溯源的唯一标识
	CropID string `json:"crop_id"`
	//植物ID
	PlantID string `json:"plant_id"`
	//植物名
	PlantName string `json:"plant_name"`
	//种植时间
	PlantDate string `json:"plant_date"`
	//收获时间
	HarvestDate string `json:"harvest_date"`
	//批次净重
	CropWeight int `json:"crop_weight"`
	//该作物创建时间,自动获取时间戳
	CreateTime string `json:"create_time"`
	//0: Initial 1:Transport_pending1 2:Process_pending 3:Transport_pending2 4:Retailer_pending 5:Finished
	CurrentPhase int `json:"current_phase"`
	//记录农产品当前所处位置
	CurrentOwner string `json:"current_owner"`
	//作物基本简介
	Intro string `json:"intro"`
	//特殊备注
	Remarks string `json:"remarks"`
}

//Initialize the Crops, this function would be invoked only once
func (s *SmartContract) InitCrop(ctx contractapi.TransactionContextInterface) error {
	crops := []Crop{
		{
			CropID:       "001",
			PlantID:      "01",
			PlantName:    "Xiaozhong Tea",
			PlantDate:    "2020/3/19",
			HarvestDate:  "2022/3/19",
			CropWeight:   1000,
			CreateTime:   "2022/4/10 16:26:30",
			CurrentPhase: 0,
			CurrentOwner: "Qiaosi",
			Intro:        "This is a brilliant tea",
			Remarks:      "This is just a sample crop",
		},
		{
			CropID:       "002",
			PlantID:      "02",
			PlantName:    "Dazhong Tea",
			PlantDate:    "2020/3/19",
			HarvestDate:  "2022/3/19",
			CropWeight:   1600,
			CreateTime:   "2022/4/10 16:27:32",
			CurrentPhase: 0,
			CurrentOwner: "Qiaosi",
			Intro:        "This is an another brilliant tea",
			Remarks:      "This is just a sample crop",
		},
		{
			CropID:       "003",
			PlantID:      "03",
			PlantName:    "Zhongzhong Tea",
			PlantDate:    "2020/3/19",
			HarvestDate:  "2022/3/19",
			CropWeight:   1600,
			CreateTime:   "2022/4/10 16:29:14",
			CurrentPhase: 0,
			CurrentOwner: "Lishui",
			Intro:        "This is an unique brilliant tea",
			Remarks:      "This is just a sample crop",
		},
		{
			CropID:       "004",
			PlantID:      "04",
			PlantName:    "Hugezhong Tea",
			PlantDate:    "2020/3/19",
			HarvestDate:  "2022/3/19",
			CropWeight:   1300,
			CreateTime:   "2022/4/10 17:08:16",
			CurrentPhase: 0,
			CurrentOwner: "Shengtong",
			Intro:        "This is an huge brilliant tea",
			Remarks:      "This is just a sample crop",
		},
		{
			CropID:       "005",
			PlantID:      "04",
			PlantName:    "Hugezhong Tea",
			PlantDate:    "2020/4/16",
			HarvestDate:  "2022/4/20",
			CropWeight:   1500,
			CreateTime:   "2022/4/13 17:08:16",
			CurrentPhase: 1,
			CurrentOwner: "Shunfeng",
			Intro:        "This is an huge brilliant tea",
			Remarks:      "This is just a sample crop",
		},
		{
			CropID:       "006",
			PlantID:      "09",
			PlantName:    "asag Tea",
			PlantDate:    "2020/4/16",
			HarvestDate:  "2022/4/20",
			CropWeight:   1500,
			CreateTime:   "2022/4/13 17:08:16",
			CurrentPhase: 0,
			CurrentOwner: "Qiaosi",
			Intro:        "This is an huge brilliant tea",
			Remarks:      "This is just a sample crop",
		},
		{
			CropID:       "007",
			PlantID:      "08",
			PlantName:    "fah Tea",
			PlantDate:    "2020/4/16",
			HarvestDate:  "2022/4/20",
			CropWeight:   1500,
			CreateTime:   "2022/4/13 17:08:16",
			CurrentPhase: 0,
			CurrentOwner: "Qiaosi",
			Intro:        "This is an brilliant tea",
			Remarks:      "This is just a sample crop",
		},
		{
			CropID:       "008",
			PlantID:      "12",
			PlantName:    "金银花",
			PlantDate:    "2019/4/16",
			HarvestDate:  "2022/4/20",
			CropWeight:   1500,
			CreateTime:   "2022/4/13 17:08:16",
			CurrentPhase: 0,
			CurrentOwner: "Qiaosi",
			Intro:        "This is an brilliant tea",
			Remarks:      "This is just a sample crop",
		},
		{
			CropID:       "009",
			PlantID:      "15",
			PlantName:    "冬虫夏草",
			PlantDate:    "2015/4/16",
			HarvestDate:  "2020/4/20",
			CropWeight:   1500,
			CreateTime:   "2022/4/16 17:08:16",
			CurrentPhase: 0,
			CurrentOwner: "Qiaosi",
			Intro:        "This is an brilliant tea",
			Remarks:      "This is just a sample crop",
		},
		{
			CropID:       "009",
			PlantID:      "15",
			PlantName:    "川贝",
			PlantDate:    "2015/4/16",
			HarvestDate:  "2020/4/20",
			CropWeight:   1500,
			CreateTime:   "2022/4/16 17:08:16",
			CurrentPhase: 2,
			CurrentOwner: "富士康",
			Intro:        "This is an brilliant tea",
			Remarks:      "This is just a sample crop",
		},
		{
			CropID:       "010",
			PlantID:      "15",
			PlantName:    "川贝",
			PlantDate:    "2015/4/16",
			HarvestDate:  "2020/4/20",
			CropWeight:   1500,
			CreateTime:   "2022/4/16 17:08:16",
			CurrentPhase: 3,
			CurrentOwner: "京东",
			Intro:        "This is an brilliant tea",
			Remarks:      "This is just a sample crop",
		},
		{
			CropID:       "011",
			PlantID:      "15",
			PlantName:    "川贝",
			PlantDate:    "2012/4/16",
			HarvestDate:  "2017/4/20",
			CropWeight:   1500,
			CreateTime:   "2022/4/16 17:08:16",
			CurrentPhase: 4,
			CurrentOwner: "苏宁",
			Intro:        "This is an brilliant tea",
			Remarks:      "This is just a sample crop",
		},
		{
			CropID:       "012",
			PlantID:      "18",
			PlantName:    "人参",
			PlantDate:    "2009/4/16",
			HarvestDate:  "2017/4/20",
			CropWeight:   1500,
			CreateTime:   "2022/4/16 17:08:16",
			CurrentPhase: 5,
			CurrentOwner: "-",
			Intro:        "This is an brilliant tea",
			Remarks:      "This is just a sample crop",
		},
	}
	for _, crop := range crops {
		cropJSON, err := json.Marshal(crop)
		if err != nil {
			return err
		}
		err = ctx.GetStub().PutState(crop.CropID, cropJSON)
		if err != nil {
			return fmt.Errorf("failed to put to world state. %v", err)
		}
	}

	return nil
}

//Create a new crop order
func (s *SmartContract) CreateCrop(ctx contractapi.TransactionContextInterface, cropID string, plantID string, plantName string, plantDate string, harvestDate string, cropWeight int, createTime string, currentPhase int, currentOwner string, intro string, remarks string) error {
	exists, err := s.CropExists(ctx, cropID)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the crop %s already exists", cropID)
	}

	crop := Crop{
		CropID:       cropID,
		PlantID:      plantID,
		PlantName:    plantName,
		PlantDate:    plantDate,
		HarvestDate:  harvestDate,
		CropWeight:   cropWeight,
		CreateTime:   createTime,
		CurrentPhase: currentPhase,
		CurrentOwner: currentOwner,
		Intro:        intro,
		Remarks:      remarks,
	}
	cropJSON, err := json.Marshal(crop)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(cropID, cropJSON)
}

// Update the basic informations
func (s *SmartContract) UpdateCrop(ctx contractapi.TransactionContextInterface, cropID string, plantID string, plantName string, plantDate string, harvestDate string, cropWeight int, createTime string, currentPhase int, currentOwner string, intro string, remarks string) error {
	crop, err := s.ReadCrop(ctx, cropID)
	if err != nil {
		return err
	}
	// overwriting original food with new info
	crop.CropID = cropID
	crop.PlantID = plantID
	crop.PlantName = plantName
	crop.PlantDate = plantDate
	crop.HarvestDate = harvestDate
	crop.CropWeight = cropWeight
	crop.CreateTime = createTime
	crop.CurrentPhase = currentPhase
	crop.CurrentOwner = currentOwner
	crop.Intro = intro
	crop.Remarks = remarks
	cropJSON, err := json.Marshal(crop)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(cropID, cropJSON)
}

//Get the crop file
func (s *SmartContract) ReadCrop(ctx contractapi.TransactionContextInterface, cropID string) (*Crop, error) {
	cropJSON, err := ctx.GetStub().GetState(cropID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if cropJSON == nil {
		return nil, fmt.Errorf("the Crop %s does not exist", cropID)
	}

	var crop Crop
	err = json.Unmarshal(cropJSON, &crop)
	if err != nil {
		return nil, err
	}

	return &crop, nil
}

//Check if the crop order existed
func (s *SmartContract) CropExists(ctx contractapi.TransactionContextInterface, cropID string) (bool, error) {
	cropJSON, err := ctx.GetStub().GetState(cropID)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return cropJSON != nil, nil
}

//Transfer the crop to  transport server
func (s *SmartContract) TransferCrop(ctx contractapi.TransactionContextInterface, cropID string, newPhase int, newOwner string) error {
	crop, err := s.ReadCrop(ctx, cropID)
	if err != nil {
		return err
	}

	crop.CurrentPhase = newPhase
	crop.CurrentOwner = newOwner

	cropJSON, err := json.Marshal(crop)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(cropID, cropJSON)
}

//Get the crops which the owner have -- conditions: Owner = farm_name
func (s *SmartContract) QueryByOwner(ctx contractapi.TransactionContextInterface, owner string) ([]*Crop, error) {
	queryString := fmt.Sprintf(`
	{
		"selector":{
		"current_owner":{"$eq":"%s"}
		}
	}
	`, owner)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	defer resultsIterator.Close()

	var crops []*Crop
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var crop Crop
		err = json.Unmarshal(queryResponse.Value, &crop)
		if err != nil {
			return nil, err
		}
		crops = append(crops, &crop)
	}
	return crops, err
}

//Get all crop orders according to the plant id
func (s *SmartContract) QueryByPlantId(ctx contractapi.TransactionContextInterface, plantID string) ([]*Crop, error) {
	queryString := fmt.Sprintf(`
	{
		"selector":{
		"plant_id":{"$eq":"%s"}
		}
	}
	`, plantID)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	defer resultsIterator.Close()

	var crops []*Crop
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var crop Crop
		err = json.Unmarshal(queryResponse.Value, &crop)
		if err != nil {
			return nil, err
		}
		crops = append(crops, &crop)
	}
	return crops, err
}

//Get all crops a phase have
func (s *SmartContract) QueryByPhase(ctx contractapi.TransactionContextInterface, phase int) ([]*Crop, error) {
	queryString := fmt.Sprintf(`
	{
		"selector":{
		"current_phase":{"$eq":"%d"}
		}
	}
	`, phase)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	defer resultsIterator.Close()

	var crops []*Crop
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var crop Crop
		err = json.Unmarshal(queryResponse.Value, &crop)
		if err != nil {
			return nil, err
		}
		crops = append(crops, &crop)
	}
	return crops, err
}

//Get all the crops the ledger have
func (s *SmartContract) QueryAllCrops(ctx contractapi.TransactionContextInterface) ([]*Crop, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var crops []*Crop
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var crop Crop
		err = json.Unmarshal(queryResponse.Value, &crop)
		if err != nil {
			return nil, err
		}
		crops = append(crops, &crop)
	}

	return crops, nil
}
