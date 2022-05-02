pragma solidity >=0.5.0 <0.8.0;

contract UploadCrop{
  mapping(string => string) Crop;

  function uploadInfo(string memory _cropId, string memory _crophash) public {
    Crop[_cropId]=_crophash;
  }

  function getHash(string memory _cropId)view public returns(string memory){
      return Crop[_cropId];
  }
}