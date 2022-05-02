package Info

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// RetailerContract provides functions for managing an Asset
type RetailerContract struct {
	contractapi.Contract
}

type Product struct {
	//产品ID，产品唯一标识符
	ProductID string `json:"product_id"`
	//作物ID（作为溯源的ID）
	CropID string `json:"crop_id"`
	//销售商ID
	RetailerID string `json:"retailer_id"`
	//销售商名
	RetailerName string `json:"retailer_name"`
	//经销商ID
	TraderID string `json:"trader_id"`
	//经销商名
	TraderName string `json:"trader_name"`
	//准授证书
	RetailerCertUrl string `json:"retailer_cert_url"`
	//上市时间
	BuyoutTime string `json:"buyout_time"`
	//备注
	Remarks string `json:"remarks"`
}

func (s *RetailerContract) RecordProduct(ctx contractapi.TransactionContextInterface, productID string, cropID string, retailerID string, retailerName string, traderID string, traderName string, retailerCerUrl string, buyoutTime string, remarks string) error {
	exists, err := s.ProductExists(ctx, productID)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the record %s already have", retailerID)
	}

	product := Product{
		ProductID:       productID,
		CropID:          cropID,
		RetailerID:      retailerID,
		RetailerName:    retailerName,
		TraderID:        traderID,
		TraderName:      traderName,
		RetailerCertUrl: retailerCerUrl,
		BuyoutTime:      buyoutTime,
		Remarks:         remarks,
	}
	productJSON, err := json.Marshal(product)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(productID, productJSON)
}

func (s *RetailerContract) UpdateProduct(ctx contractapi.TransactionContextInterface, productID string, cropID string, retailerID string, retailerName string, traderID string, traderName string, retailerCerUrl string, buyoutTime string, remarks string) error {
	product, err := s.ReadByProduct(ctx, productID)
	if err != nil {
		return err
	}
	// overwriting original food with new info
	product.ProductID = productID
	product.CropID = cropID
	product.RetailerID = retailerID
	product.RetailerName = retailerName
	product.TraderID = traderID
	product.TraderName = traderName
	product.RetailerCertUrl = retailerCerUrl
	product.BuyoutTime = buyoutTime
	product.Remarks = remarks

	productJSON, err := json.Marshal(productID)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(productID, productJSON)
}

func (s *RetailerContract) ReadByProduct(ctx contractapi.TransactionContextInterface, productID string) (*Product, error) {
	productJSON, err := ctx.GetStub().GetState(productID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if productJSON == nil {
		return nil, fmt.Errorf("the Product ID %s does not exist", productID)
	}

	var product Product
	err = json.Unmarshal(productJSON, &product)
	if err != nil {
		return nil, err
	}

	return &product, nil
}

// Check if the productID is exist
func (s *RetailerContract) ProductExists(ctx contractapi.TransactionContextInterface, productID string) (bool, error) {
	productJSON, err := ctx.GetStub().GetState(productID)
	if err != nil { // Check if the farm is exist
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}
	return productJSON != nil, nil
}

// Get all Products from the world state
func (s *RetailerContract) QueryAllProducts(ctx contractapi.TransactionContextInterface) ([]*Product, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var producers []*Product
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var producer Product
		err = json.Unmarshal(queryResponse.Value, &producer)
		if err != nil {
			return nil, err
		}
		producers = append(producers, &producer)
	}
	return producers, err
}

func (s *RetailerContract) QueryByCrop(ctx contractapi.TransactionContextInterface, cropID string) ([]*Product, error) {
	queryString := fmt.Sprintf("{\"selector\":{\"crop_id\":{\"$eq\":\"%s\"}}}", cropID)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	defer resultsIterator.Close()

	var products []*Product
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var product Product
		err = json.Unmarshal(queryResponse.Value, &product)
		if err != nil {
			return nil, err
		}
		products = append(products, &product)
	}
	return products, err
}

func (s *RetailerContract) QueryByRetailer(ctx contractapi.TransactionContextInterface, retailerID string) ([]*Product, error) {
	queryString := fmt.Sprintf("{\"selector\":{\"retailer_id\":{\"$eq\":\"%s\"}}}", retailerID)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	defer resultsIterator.Close()

	var products []*Product
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var product Product
		err = json.Unmarshal(queryResponse.Value, &product)
		if err != nil {
			return nil, err
		}
		products = append(products, &product)
	}
	return products, err
}
