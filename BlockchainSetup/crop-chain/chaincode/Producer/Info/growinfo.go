package Info

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type ProducerContract struct {
	contractapi.Contract
}

type GrowInfo struct {
	//生长情况唯一ID
	GrowID string `json:"grow_id"`
	//作物ID
	CropID string `json:"crop_id"`
	//农场ID，用作客户端便利所有Crop
	FarmID string `json:"farm_id"`
	//农场名
	FarmName string `json:"farm_name"`
	//农户ID
	FarmerID string `json:"farmer_id"`
	//农户名
	FarmerName string `json:"farmer_name"`
	//记录时间
	RecordTime string `json:"record_time"`
	//作物生长图片URL
	CropsGrowPhotoUrl string `json:"crop_grow_photo_url"`
	//生长情况
	GrowStatus string `json:"grow_status"`
	//肥料名
	FertilizerName string `json:"fertilizer_name"`
	//种植方式
	PlatMode string `json:"plat_mode"`
	//光照情况
	IlluminationStatus string `json:"illumination_status"`
	//备注
	Remarks string `json:"remarks"`
}

//初始化几个生长状况订单，用于测试
func (s *ProducerContract) InitInfo(ctx contractapi.TransactionContextInterface) error {
	growInfos := []GrowInfo{
		{
			GrowID:             "0001",
			CropID:             "001",
			FarmID:             "00001",
			FarmName:           "Qiaosi",
			FarmerID:           "0A",
			FarmerName:         "Yan Zihan",
			RecordTime:         "2022.4.9 17:16:30",
			CropsGrowPhotoUrl:  "www.baidu.com",
			GrowStatus:         "normal",
			FertilizerName:     "jin kela",
			PlatMode:           "hi",
			IlluminationStatus: "good",
			Remarks:            "no",
		},
		{
			GrowID:             "0002",
			CropID:             "002",
			FarmID:             "00001",
			FarmName:           "Qiaosi",
			FarmerID:           "0B",
			FarmerName:         "Wang Huahua",
			RecordTime:         "2022.4.9 17:20:30",
			CropsGrowPhotoUrl:  "www.baidu.com",
			GrowStatus:         "normal",
			FertilizerName:     "jin kela",
			PlatMode:           "hi",
			IlluminationStatus: "good",
			Remarks:            "no",
		},
		{
			GrowID:             "0003",
			CropID:             "003",
			FarmID:             "00002",
			FarmName:           "Lishui",
			FarmerID:           "0B",
			FarmerName:         "Wang Huahua",
			RecordTime:         "2022.4.9 17:20:30",
			CropsGrowPhotoUrl:  "www.baidu.com",
			GrowStatus:         "normal",
			FertilizerName:     "jin kela",
			PlatMode:           "hi",
			IlluminationStatus: "good",
			Remarks:            "no",
		},
		{
			GrowID:             "0004",
			CropID:             "004",
			FarmID:             "00002",
			FarmName:           "Lishui",
			FarmerID:           "0C",
			FarmerName:         "Li Gougou",
			RecordTime:         "2022.4.9 17:21:30",
			CropsGrowPhotoUrl:  "www.baidu.com",
			GrowStatus:         "normal",
			FertilizerName:     "jin kela",
			PlatMode:           "hi",
			IlluminationStatus: "good",
			Remarks:            "no",
		},

		{
			GrowID:             "0005",
			CropID:             "005",
			FarmID:             "00001",
			FarmName:           "Qiaosi",
			FarmerID:           "0B",
			FarmerName:         "Wang Huahua",
			RecordTime:         "2022.4.9 17:20:30",
			CropsGrowPhotoUrl:  "www.baidu.com",
			GrowStatus:         "normal",
			FertilizerName:     "jin kela",
			PlatMode:           "hi",
			IlluminationStatus: "good",
			Remarks:            "no",
		},
	}

	for _, growInfo := range growInfos {
		growJSON, err := json.Marshal(growInfo)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(growInfo.GrowID, growJSON)
		if err != nil {
			return fmt.Errorf("failed to put to world state. %v", err)
		}
	}

	return nil
}

//创建一个记录生长状况的订单
func (s *ProducerContract) RecordInfo(ctx contractapi.TransactionContextInterface, growID string, cropID string, farmID string, farmName string, farmerID string, farmerName string, recordTime string, cropsGrowPhotoUrl string, growStatus string, fertilizerName string, platMode string, illuminationStatus string, remarks string) error {
	exists, err := s.GrowExists(ctx, growID)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the crop %s already have recorded grow info", cropID)
	}

	growInfo := GrowInfo{
		GrowID:             growID,
		CropID:             cropID,
		FarmID:             farmID,
		FarmName:           farmName,
		FarmerID:           farmerID,
		FarmerName:         farmerName,
		RecordTime:         recordTime,
		CropsGrowPhotoUrl:  cropsGrowPhotoUrl,
		GrowStatus:         growStatus,
		FertilizerName:     fertilizerName,
		PlatMode:           platMode,
		IlluminationStatus: illuminationStatus,
		Remarks:            remarks,
	}
	growJSON, err := json.Marshal(growInfo)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(growID, growJSON)
}

//更新生长状况订单信息
func (s *ProducerContract) UpdateInfo(ctx contractapi.TransactionContextInterface, growID string, cropID string, farmID string, farmName string, farmerID string, farmerName string, recordTime string, cropsGrowPhotoUrl string, growStatus string, fertilizerName string, platMode string, illuminationStatus string, remarks string) error {
	growInfo, err := s.ReadByGrow(ctx, growID)
	if err != nil {
		return err
	}
	// overwriting original food with new info
	growInfo.GrowID = growID
	growInfo.CropID = cropID
	growInfo.FarmID = farmID
	growInfo.FarmName = farmName
	growInfo.FarmerID = farmerID
	growInfo.FarmerName = farmerName
	growInfo.RecordTime = recordTime
	growInfo.CropsGrowPhotoUrl = cropsGrowPhotoUrl
	growInfo.GrowStatus = growStatus
	growInfo.FertilizerName = fertilizerName
	growInfo.PlatMode = platMode
	growInfo.IlluminationStatus = illuminationStatus
	growInfo.Remarks = remarks

	growJSON, err := json.Marshal(growInfo)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(growID, growJSON)
}

//根据growid获取农产品信息
func (s *ProducerContract) ReadByGrow(ctx contractapi.TransactionContextInterface, growID string) (*GrowInfo, error) {
	growJSON, err := ctx.GetStub().GetState(growID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if growJSON == nil {
		return nil, fmt.Errorf("the Grow Info %s does not exist", growID)
	}

	var growInfo GrowInfo
	err = json.Unmarshal(growJSON, &growInfo)
	if err != nil {
		return nil, err
	}

	return &growInfo, nil
}

// Check if the growinfo is exist
func (s *ProducerContract) GrowExists(ctx contractapi.TransactionContextInterface, growID string) (bool, error) {
	growJSON, err := ctx.GetStub().GetState(growID)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return growJSON != nil, nil
}

//查找所有生长情况订单
func (s *ProducerContract) QueryAllGrows(ctx contractapi.TransactionContextInterface) ([]*GrowInfo, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var growInfos []*GrowInfo
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var growInfo GrowInfo
		err = json.Unmarshal(queryResponse.Value, &growInfo)
		if err != nil {
			return nil, err
		}
		growInfos = append(growInfos, &growInfo)
	}

	return growInfos, nil
}

//根据Cropid查询对应的生长状况订单
func (s *ProducerContract) QueryByCrop(ctx contractapi.TransactionContextInterface, cropID string) ([]*GrowInfo, error) {
	queryString := fmt.Sprintf("{\"selector\":{\"crop_id\":{\"$eq\":\"%s\"}}}", cropID)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	defer resultsIterator.Close()

	var growInfos []*GrowInfo
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var growInfo GrowInfo
		err = json.Unmarshal(queryResponse.Value, &growInfo)
		if err != nil {
			return nil, err
		}
		growInfos = append(growInfos, &growInfo)
	}
	return growInfos, err
}

//根据FarmID查询对应农场下全部的生长状况订单
func (s *ProducerContract) QueryByFarmId(ctx contractapi.TransactionContextInterface, farmID string) ([]*GrowInfo, error) {
	queryString := fmt.Sprintf(`
	{
		"selector":{
			"farm_id":{"$eq":"%s"}
		}
	}
	`, farmID)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	defer resultsIterator.Close()

	var growInfos []*GrowInfo
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var growInfo GrowInfo
		err = json.Unmarshal(queryResponse.Value, &growInfo)
		if err != nil {
			return nil, err
		}
		growInfos = append(growInfos, &growInfo)
	}
	return growInfos, err
}
