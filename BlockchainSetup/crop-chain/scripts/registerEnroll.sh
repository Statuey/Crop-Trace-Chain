#!/bin/bash

function createOrg1() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/org1.trace.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org1.trace.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-org1 --tls.certfiles "${PWD}/organizations/fabric-ca/org1/ca-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-org1.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-org1.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-org1.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-org1.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/org1.trace.com/msp/config.yaml"

  # Since the CA serves as both the organization CA and TLS CA, copy the org's root cert that was generated by CA startup into the org level ca and tlsca directories

  # Copy org1's CA cert to org1's /msp/tlscacerts directory (for use in the channel MSP definition)
  mkdir -p "${PWD}/organizations/peerOrganizations/org1.trace.com/msp/tlscacerts"
  cp "${PWD}/organizations/fabric-ca/org1/ca-cert.pem" "${PWD}/organizations/peerOrganizations/org1.trace.com/msp/tlscacerts/ca.crt"

  # Copy org1's CA cert to org1's /tlsca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/org1.trace.com/tlsca"
  cp "${PWD}/organizations/fabric-ca/org1/ca-cert.pem" "${PWD}/organizations/peerOrganizations/org1.trace.com/tlsca/tlsca.org1.trace.com-cert.pem"

  # Copy org1's CA cert to org1's /ca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/org1.trace.com/ca"
  cp "${PWD}/organizations/fabric-ca/org1/ca-cert.pem" "${PWD}/organizations/peerOrganizations/org1.trace.com/ca/ca.org1.trace.com-cert.pem"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-org1 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/org1/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-org1 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/org1/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-org1 --id.name org1admin --id.secret org1adminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/org1/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-org1 -M "${PWD}/organizations/peerOrganizations/org1.trace.com/peers/peer0.org1.trace.com/msp" --csr.hosts peer0.org1.trace.com --tls.certfiles "${PWD}/organizations/fabric-ca/org1/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org1.trace.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org1.trace.com/peers/peer0.org1.trace.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-org1 -M "${PWD}/organizations/peerOrganizations/org1.trace.com/peers/peer0.org1.trace.com/tls" --enrollment.profile tls --csr.hosts peer0.org1.trace.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/org1/ca-cert.pem"
  { set +x; } 2>/dev/null

  # Copy the tls CA cert, server cert, server keystore to well known file names in the peer's tls directory that are referenced by peer startup config
  cp "${PWD}/organizations/peerOrganizations/org1.trace.com/peers/peer0.org1.trace.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/org1.trace.com/peers/peer0.org1.trace.com/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/org1.trace.com/peers/peer0.org1.trace.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/org1.trace.com/peers/peer0.org1.trace.com/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/org1.trace.com/peers/peer0.org1.trace.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/org1.trace.com/peers/peer0.org1.trace.com/tls/server.key"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-org1 -M "${PWD}/organizations/peerOrganizations/org1.trace.com/users/User1@org1.trace.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org1/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org1.trace.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org1.trace.com/users/User1@org1.trace.com/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://org1admin:org1adminpw@localhost:7054 --caname ca-org1 -M "${PWD}/organizations/peerOrganizations/org1.trace.com/users/Admin@org1.trace.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org1/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org1.trace.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org1.trace.com/users/Admin@org1.trace.com/msp/config.yaml"
}

function createOrg2() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/org2.trace.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org2.trace.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7064 --caname ca-org2 --tls.certfiles "${PWD}/organizations/fabric-ca/org2/ca-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7064-ca-org2.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7064-ca-org2.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7064-ca-org2.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7064-ca-org2.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/org2.trace.com/msp/config.yaml"

  # Since the CA serves as both the organization CA and TLS CA, copy the org's root cert that was generated by CA startup into the org level ca and tlsca directories

  # Copy org2's CA cert to org2's /msp/tlscacerts directory (for use in the channel MSP definition)
  mkdir -p "${PWD}/organizations/peerOrganizations/org2.trace.com/msp/tlscacerts"
  cp "${PWD}/organizations/fabric-ca/org2/ca-cert.pem" "${PWD}/organizations/peerOrganizations/org2.trace.com/msp/tlscacerts/ca.crt"

  # Copy org2's CA cert to org2's /tlsca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/org2.trace.com/tlsca"
  cp "${PWD}/organizations/fabric-ca/org2/ca-cert.pem" "${PWD}/organizations/peerOrganizations/org2.trace.com/tlsca/tlsca.org2.trace.com-cert.pem"

  # Copy org2's CA cert to org2's /ca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/org2.trace.com/ca"
  cp "${PWD}/organizations/fabric-ca/org2/ca-cert.pem" "${PWD}/organizations/peerOrganizations/org2.trace.com/ca/ca.org2.trace.com-cert.pem"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-org2 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/org2/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-org2 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/org2/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-org2 --id.name org2admin --id.secret org2adminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/org2/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7064 --caname ca-org2 -M "${PWD}/organizations/peerOrganizations/org2.trace.com/peers/peer0.org2.trace.com/msp" --csr.hosts peer0.org2.trace.com --tls.certfiles "${PWD}/organizations/fabric-ca/org2/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org2.trace.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org2.trace.com/peers/peer0.org2.trace.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7064 --caname ca-org2 -M "${PWD}/organizations/peerOrganizations/org2.trace.com/peers/peer0.org2.trace.com/tls" --enrollment.profile tls --csr.hosts peer0.org2.trace.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/org2/ca-cert.pem"
  { set +x; } 2>/dev/null

  # Copy the tls CA cert, server cert, server keystore to well known file names in the peer's tls directory that are referenced by peer startup config
  cp "${PWD}/organizations/peerOrganizations/org2.trace.com/peers/peer0.org2.trace.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/org2.trace.com/peers/peer0.org2.trace.com/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/org2.trace.com/peers/peer0.org2.trace.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/org2.trace.com/peers/peer0.org2.trace.com/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/org2.trace.com/peers/peer0.org2.trace.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/org2.trace.com/peers/peer0.org2.trace.com/tls/server.key"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7064 --caname ca-org2 -M "${PWD}/organizations/peerOrganizations/org2.trace.com/users/User1@org2.trace.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org2/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org2.trace.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org2.trace.com/users/User1@org2.trace.com/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://org2admin:org2adminpw@localhost:7064 --caname ca-org2 -M "${PWD}/organizations/peerOrganizations/org2.trace.com/users/Admin@org2.trace.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org2/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org2.trace.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org2.trace.com/users/Admin@org2.trace.com/msp/config.yaml"
}

function createOrg3() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/org3.trace.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org3.trace.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:8054 --caname ca-org3 --tls.certfiles "${PWD}/organizations/fabric-ca/org3/ca-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-org3.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-org3.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-org3.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-org3.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/org3.trace.com/msp/config.yaml"

  # Since the CA serves as both the organization CA and TLS CA, copy the org's root cert that was generated by CA startup into the org level ca and tlsca directories

  # Copy org3's CA cert to org3's /msp/tlscacerts directory (for use in the channel MSP definition)
  mkdir -p "${PWD}/organizations/peerOrganizations/org3.trace.com/msp/tlscacerts"
  cp "${PWD}/organizations/fabric-ca/org3/ca-cert.pem" "${PWD}/organizations/peerOrganizations/org3.trace.com/msp/tlscacerts/ca.crt"

  # Copy org3's CA cert to org3's /tlsca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/org3.trace.com/tlsca"
  cp "${PWD}/organizations/fabric-ca/org3/ca-cert.pem" "${PWD}/organizations/peerOrganizations/org3.trace.com/tlsca/tlsca.org3.trace.com-cert.pem"

  # Copy org3's CA cert to org3's /ca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/org3.trace.com/ca"
  cp "${PWD}/organizations/fabric-ca/org3/ca-cert.pem" "${PWD}/organizations/peerOrganizations/org3.trace.com/ca/ca.org3.trace.com-cert.pem"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-org3 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/org3/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-org3 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/org3/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-org3 --id.name org3admin --id.secret org3adminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/org3/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-org3 -M "${PWD}/organizations/peerOrganizations/org3.trace.com/peers/peer0.org3.trace.com/msp" --csr.hosts peer0.org3.trace.com --tls.certfiles "${PWD}/organizations/fabric-ca/org3/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org3.trace.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org3.trace.com/peers/peer0.org3.trace.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-org3 -M "${PWD}/organizations/peerOrganizations/org3.trace.com/peers/peer0.org3.trace.com/tls" --enrollment.profile tls --csr.hosts peer0.org3.trace.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/org3/ca-cert.pem"
  { set +x; } 2>/dev/null

  # Copy the tls CA cert, server cert, server keystore to well known file names in the peer's tls directory that are referenced by peer startup config
  cp "${PWD}/organizations/peerOrganizations/org3.trace.com/peers/peer0.org3.trace.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/org3.trace.com/peers/peer0.org3.trace.com/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/org3.trace.com/peers/peer0.org3.trace.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/org3.trace.com/peers/peer0.org3.trace.com/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/org3.trace.com/peers/peer0.org3.trace.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/org3.trace.com/peers/peer0.org3.trace.com/tls/server.key"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:8054 --caname ca-org3 -M "${PWD}/organizations/peerOrganizations/org3.trace.com/users/User1@org3.trace.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org3/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org3.trace.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org3.trace.com/users/User1@org3.trace.com/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://org3admin:org3adminpw@localhost:8054 --caname ca-org3 -M "${PWD}/organizations/peerOrganizations/org3.trace.com/users/Admin@org3.trace.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org3/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org3.trace.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org3.trace.com/users/Admin@org3.trace.com/msp/config.yaml"
}

function createOrg4() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/org4.trace.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org4.trace.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:8064 --caname ca-org4 --tls.certfiles "${PWD}/organizations/fabric-ca/org4/ca-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8064-ca-org4.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8064-ca-org4.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8064-ca-org4.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8064-ca-org4.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/org4.trace.com/msp/config.yaml"

  # Since the CA serves as both the organization CA and TLS CA, copy the org's root cert that was generated by CA startup into the org level ca and tlsca directories

  # Copy org4's CA cert to org4's /msp/tlscacerts directory (for use in the channel MSP definition)
  mkdir -p "${PWD}/organizations/peerOrganizations/org4.trace.com/msp/tlscacerts"
  cp "${PWD}/organizations/fabric-ca/org4/ca-cert.pem" "${PWD}/organizations/peerOrganizations/org4.trace.com/msp/tlscacerts/ca.crt"

  # Copy org4's CA cert to org4's /tlsca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/org4.trace.com/tlsca"
  cp "${PWD}/organizations/fabric-ca/org4/ca-cert.pem" "${PWD}/organizations/peerOrganizations/org4.trace.com/tlsca/tlsca.org4.trace.com-cert.pem"

  # Copy org4's CA cert to org4's /ca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/org4.trace.com/ca"
  cp "${PWD}/organizations/fabric-ca/org4/ca-cert.pem" "${PWD}/organizations/peerOrganizations/org4.trace.com/ca/ca.org4.trace.com-cert.pem"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-org4 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/org4/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-org4 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/org4/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-org4 --id.name org4admin --id.secret org4adminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/org4/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8064 --caname ca-org4 -M "${PWD}/organizations/peerOrganizations/org4.trace.com/peers/peer0.org4.trace.com/msp" --csr.hosts peer0.org4.trace.com --tls.certfiles "${PWD}/organizations/fabric-ca/org4/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org4.trace.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org4.trace.com/peers/peer0.org4.trace.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8064 --caname ca-org4 -M "${PWD}/organizations/peerOrganizations/org4.trace.com/peers/peer0.org4.trace.com/tls" --enrollment.profile tls --csr.hosts peer0.org4.trace.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/org4/ca-cert.pem"
  { set +x; } 2>/dev/null

  # Copy the tls CA cert, server cert, server keystore to well known file names in the peer's tls directory that are referenced by peer startup config
  cp "${PWD}/organizations/peerOrganizations/org4.trace.com/peers/peer0.org4.trace.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/org4.trace.com/peers/peer0.org4.trace.com/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/org4.trace.com/peers/peer0.org4.trace.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/org4.trace.com/peers/peer0.org4.trace.com/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/org4.trace.com/peers/peer0.org4.trace.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/org4.trace.com/peers/peer0.org4.trace.com/tls/server.key"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:8064 --caname ca-org4 -M "${PWD}/organizations/peerOrganizations/org4.trace.com/users/User1@org4.trace.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org4/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org4.trace.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org4.trace.com/users/User1@org4.trace.com/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://org4admin:org4adminpw@localhost:8064 --caname ca-org4 -M "${PWD}/organizations/peerOrganizations/org4.trace.com/users/Admin@org4.trace.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org4/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org4.trace.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org4.trace.com/users/Admin@org4.trace.com/msp/config.yaml"
}

function createOrg5() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/org5.trace.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/org5.trace.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9064 --caname ca-org5 --tls.certfiles "${PWD}/organizations/fabric-ca/org5/ca-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9064-ca-org5.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9064-ca-org5.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9064-ca-org5.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9064-ca-org5.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/org5.trace.com/msp/config.yaml"

  # Since the CA serves as both the organization CA and TLS CA, copy the org's root cert that was generated by CA startup into the org level ca and tlsca directories

  # Copy org5's CA cert to org5's /msp/tlscacerts directory (for use in the channel MSP definition)
  mkdir -p "${PWD}/organizations/peerOrganizations/org5.trace.com/msp/tlscacerts"
  cp "${PWD}/organizations/fabric-ca/org5/ca-cert.pem" "${PWD}/organizations/peerOrganizations/org5.trace.com/msp/tlscacerts/ca.crt"

  # Copy org5's CA cert to org5's /tlsca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/org5.trace.com/tlsca"
  cp "${PWD}/organizations/fabric-ca/org5/ca-cert.pem" "${PWD}/organizations/peerOrganizations/org5.trace.com/tlsca/tlsca.org5.trace.com-cert.pem"

  # Copy org5's CA cert to org5's /ca directory (for use by clients)
  mkdir -p "${PWD}/organizations/peerOrganizations/org5.trace.com/ca"
  cp "${PWD}/organizations/fabric-ca/org5/ca-cert.pem" "${PWD}/organizations/peerOrganizations/org5.trace.com/ca/ca.org5.trace.com-cert.pem"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-org5 --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/org5/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-org5 --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/org5/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-org5 --id.name org5admin --id.secret org5adminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/org5/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:9064 --caname ca-org5 -M "${PWD}/organizations/peerOrganizations/org5.trace.com/peers/peer0.org5.trace.com/msp" --csr.hosts peer0.org5.trace.com --tls.certfiles "${PWD}/organizations/fabric-ca/org5/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org5.trace.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org5.trace.com/peers/peer0.org5.trace.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:9064 --caname ca-org5 -M "${PWD}/organizations/peerOrganizations/org5.trace.com/peers/peer0.org5.trace.com/tls" --enrollment.profile tls --csr.hosts peer0.org5.trace.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/org5/ca-cert.pem"
  { set +x; } 2>/dev/null

  # Copy the tls CA cert, server cert, server keystore to well known file names in the peer's tls directory that are referenced by peer startup config
  cp "${PWD}/organizations/peerOrganizations/org5.trace.com/peers/peer0.org5.trace.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/org5.trace.com/peers/peer0.org5.trace.com/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/org5.trace.com/peers/peer0.org5.trace.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/org5.trace.com/peers/peer0.org5.trace.com/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/org5.trace.com/peers/peer0.org5.trace.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/org5.trace.com/peers/peer0.org5.trace.com/tls/server.key"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:9064 --caname ca-org5 -M "${PWD}/organizations/peerOrganizations/org5.trace.com/users/User1@org5.trace.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org5/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org5.trace.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org5.trace.com/users/User1@org5.trace.com/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://org5admin:org5adminpw@localhost:9064 --caname ca-org5 -M "${PWD}/organizations/peerOrganizations/org5.trace.com/users/Admin@org5.trace.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/org5/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/org5.trace.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/org5.trace.com/users/Admin@org5.trace.com/msp/config.yaml"
}

function createOrderer() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/ordererOrganizations/trace.com

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/trace.com

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9050 --caname ca-orderer --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9050-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9050-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9050-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9050-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/ordererOrganizations/trace.com/msp/config.yaml"

  # Since the CA serves as both the organization CA and TLS CA, copy the org's root cert that was generated by CA startup into the org level ca and tlsca directories

  # Copy orderer org's CA cert to orderer org's /msp/tlscacerts directory (for use in the channel MSP definition)
  mkdir -p "${PWD}/organizations/ordererOrganizations/trace.com/msp/tlscacerts"
  cp "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem" "${PWD}/organizations/ordererOrganizations/trace.com/msp/tlscacerts/tlsca.trace.com-cert.pem"

  # Copy orderer org's CA cert to orderer org's /tlsca directory (for use by clients)
  mkdir -p "${PWD}/organizations/ordererOrganizations/trace.com/tlsca"
  cp "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem" "${PWD}/organizations/ordererOrganizations/trace.com/tlsca/tlsca.trace.com-cert.pem"

  infoln "Registering orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9050 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/trace.com/orderers/orderer.trace.com/msp" --csr.hosts orderer.trace.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/trace.com/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/trace.com/orderers/orderer.trace.com/msp/config.yaml"

  infoln "Generating the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9050 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/trace.com/orderers/orderer.trace.com/tls" --enrollment.profile tls --csr.hosts orderer.trace.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  # Copy the tls CA cert, server cert, server keystore to well known file names in the orderer's tls directory that are referenced by orderer startup config
  cp "${PWD}/organizations/ordererOrganizations/trace.com/orderers/orderer.trace.com/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/trace.com/orderers/orderer.trace.com/tls/ca.crt"
  cp "${PWD}/organizations/ordererOrganizations/trace.com/orderers/orderer.trace.com/tls/signcerts/"* "${PWD}/organizations/ordererOrganizations/trace.com/orderers/orderer.trace.com/tls/server.crt"
  cp "${PWD}/organizations/ordererOrganizations/trace.com/orderers/orderer.trace.com/tls/keystore/"* "${PWD}/organizations/ordererOrganizations/trace.com/orderers/orderer.trace.com/tls/server.key"

  # Copy orderer org's CA cert to orderer's /msp/tlscacerts directory (for use in the orderer MSP definition)
  mkdir -p "${PWD}/organizations/ordererOrganizations/trace.com/orderers/orderer.trace.com/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/trace.com/orderers/orderer.trace.com/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/trace.com/orderers/orderer.trace.com/msp/tlscacerts/tlsca.trace.com-cert.pem"

  infoln "Generating the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9050 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/trace.com/users/Admin@trace.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/ca-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/trace.com/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/trace.com/users/Admin@trace.com/msp/config.yaml"
}