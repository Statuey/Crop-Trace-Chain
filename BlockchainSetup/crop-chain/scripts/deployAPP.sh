#!/bin/bash

source scripts/utils.sh

CHANNEL_NAME=${1:-"mychannel"}
CC_NUM=${2}
CC_VERSION="1.0"
CC_SEQUENCE="1"
CC_END_POLICY=${3:-"NA"}
DELAY="3"
MAX_RETRY="5"

case $CC_NUM in
  1 )
    CC_SRC_PATH="${PWD}/chaincode/Producer"
    CC_NAME="producer"
    ;;
  2 )
    CC_SRC_PATH="${PWD}/chaincode/Process"
    CC_NAME="process"
    ;;
  3 )
    CC_SRC_PATH="${PWD}/chaincode/Transport"
    CC_NAME="transport"
    ;;
  4 )
    CC_SRC_PATH="${PWD}/chaincode/Retailer"
    CC_NAME="retailer"
    ;;
  esac

CC_RUNTIME_LANGUAGE="golang"

infoln "Vendoring Go dependencies at $CC_SRC_PATH"
pushd $CC_SRC_PATH
GO111MODULE=on go mod vendor
popd
successln "Finished vendoring Go dependencies"


# import utils
. scripts/envVar.sh
. scripts/ccutils.sh

packageChaincode() {
  set -x
  peer lifecycle chaincode package ${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CC_NAME}_${CC_VERSION} >&log.txt
  res=$?
  { set +x; } 2>/dev/null
  cat log.txt
  verifyResult $res "Chaincode packaging has failed"
  successln "Chaincode is packaged"
}

## package the chaincode
packageChaincode

## Install chaincode on peers
infoln "Installing chaincode${CC_NAME}..."
installChaincode ${CC_NUM}


## query whether the chaincode is installed
queryInstalled ${CC_NUM}

## approve the definition for org1
approveForMyOrg 1
approveForMyOrg 2
approveForMyOrg 3
approveForMyOrg 4
approveForMyOrg 5

## check whether the chaincode definition is ready to be committed
## expect them both to have approved
checkCommitReadiness ${CC_NUM} "\"Org1MSP\": true" "\"Org2MSP\": true" "\"Org3MSP\": true" "\"Org4MSP\": true" "\"Org5MSP\": true"

## now that we know for sure both orgs have approved, commit the definition
commitChaincodeDefinition 1 2 3 4 5

## query on both orgs to see that the definition committed successfully
queryCommitted ${CC_NUM}

exit 0
