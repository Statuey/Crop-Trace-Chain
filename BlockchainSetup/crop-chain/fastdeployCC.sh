#!/bin/bash
export PATH=${PWD}/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/config
source scripts/utils.sh
FULL_NAME=$(ls ${PWD}/channel-artifacts)
#infoln ${FULL_NAME}
CHANNEL_NAME=$(echo ${FULL_NAME} | cut -d . -f1)
infoln "deploying chaincode on channel '${CHANNEL_NAME}'"
# Deploy the producer CC
# scripts/deployAPP.sh $CHANNEL_NAME 1
scripts/deployCC.sh $CHANNEL_NAME "producer" "${PWD}/chaincode/Producer" "go"
# Deploy the process CC
# scripts/deployAPP.sh $CHANNEL_NAME 2
scripts/deployCC.sh $CHANNEL_NAME "process" "${PWD}/chaincode/Process" "go"
# Deploy the transport CC
# scripts/deployAPP.sh $CHANNEL_NAME 3
scripts/deployCC.sh $CHANNEL_NAME "transport" "${PWD}/chaincode/Transport" "go"
# Deploy the retailer CC
# scripts/deployAPP.sh $CHANNEL_NAME 4
scripts/deployCC.sh $CHANNEL_NAME "retailer" "${PWD}/chaincode/Retailer" "go"
# Deploy the crop chaincode
scripts/deployCC.sh $CHANNEL_NAME "crop" "${PWD}/chaincode/Crop" "go"

infoln "Successful deployed all chaincodes!"