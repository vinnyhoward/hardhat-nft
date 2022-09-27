// packages
import { ethers } from "hardhat";
// utils
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";
// types
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployRandomIpfsNft: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId!;

    let vrfCoordinatorV2Address, subscriptionId;

    if (developmentChains.includes(chainId.toString())) {
        console.log("development chain running");
        const vrfCoordinatorV2Mock = await ethers.getContract("RFCoordinatorV2Mock");
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);
        subscriptionId = transactionReceipt.events[0].args.subId;
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
        subscriptionId = networkConfig[chainId]["subscriptionId"];
    }
};

export default deployRandomIpfsNft;
deployRandomIpfsNft.tags = ["all", "randomnft", "main"];
