import { expect } from "chai";
import { ethers } from "hardhat";
import { METADATA_URL, WHITELIST_CONTRACT_ADDRESS } from "../constants/constant";

describe("CryptoDevs", async function () {
  it("Only onwer could start presale", async function(){
    const [owner, randomPerson] = await ethers.getSigners();
    const CryptoDevs = await ethers.getContractFactory("CryptoDevs");
    const cryptoDevs = await CryptoDevs.deploy(
        METADATA_URL,
        WHITELIST_CONTRACT_ADDRESS
    );

    await cryptoDevs.deployed();

    await cryptoDevs.connect(randomPerson).startPresale();
  })
});
