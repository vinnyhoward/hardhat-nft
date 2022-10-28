import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const mint: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, network, ethers } = hre;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // Basic NFT
    const basicNft = await ethers.getContract("BasicNft", deployer);
    const basicMintTx = await basicNft.mint();
    await basicMintTx.wait(1);
    console.log(`Basic NFT index 0 tokenURI: ${await basicNft.tokenURI(0)}`);

    // Random IPFS NFT
    const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer);
    const randomIpfsNftMintFee = await randomIpfsNft.getMintFee();
    const randomIpfsNftMintTx = await randomIpfsNft.requestNFT({
        value: randomIpfsNftMintFee.toString(),
    });
    const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1);

    // Need to listen for response
    await new Promise<void>(async (resolve, reject) => {
        setTimeout(resolve, 300000); // 5 minute timeout time
        // setup listener for our event
        randomIpfsNft.once("NftMinted", async () => {
            resolve();
        });
        if (chainId == 31337) {
            const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestId.toString();
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address);
        }
    });
    console.log(`Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`);

    // Dynamic SVG  NFT
    const highValue = ethers.utils.parseEther("4000");
    const dynamicSvgNft = await ethers.getContract("DynamicSvgNft", deployer);
    const dynamicSvgNftMintFee = await dynamicSvgNft.getMintFee();
    console.log('big number:', dynamicSvgNftMintFee)
    const dynamicSvgNftMintTx = await dynamicSvgNft.mint(
        highValue.toString(),
        { value: dynamicSvgNftMintFee.toString() }
    );
    await dynamicSvgNftMintTx.wait(1);
    console.log(`Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.tokenURI(0)}`);
};
export default mint;
mint.tags = ["all", "mint"];
