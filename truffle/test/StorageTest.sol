// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../contracts/Storage.sol";
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";

contract StorageTest {

  function testWriteValue() public {
    Storage valueStorage = Storage(DeployedAddresses.Storage());

    Assert.equal(valueStorage.read(), 0, "Contract should have 0 stored");
    valueStorage.write(1);
    Assert.equal(valueStorage.read(), 1, "Contract should have 1 stored");
    valueStorage.write(2);
    Assert.equal(valueStorage.read(), 2, "Contract should have 2 stored");
  }
}
