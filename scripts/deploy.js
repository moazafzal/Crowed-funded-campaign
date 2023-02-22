// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}
async function main() {
    
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    // const[deployer] = await ethers.getSigners()

    //Deploy Contract
    const MyToken = await ethers.getContractFactory("MyToken");
    const CampaignFactory = await ethers.getContractFactory("CampaignManager");
    // deploy contracts
    const myToken = await MyToken.deploy()
    await myToken.deployed()

    const campaignFactory = await CampaignFactory.deploy(myToken.address);
    await campaignFactory.deployed()
    console.log(`Deployed CampaignFactory Contract at: ${campaignFactory.address}\n`)
    console.log(`Deployed myToken Contract at: ${myToken.address}\n`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
