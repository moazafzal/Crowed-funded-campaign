const { expect } = require("chai");

describe("TokenPledge", () => {
  const token = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
  }
  const fromEhter = (n) => {
    return ethers.utils.formatEther(n)
  }
  let tokenPledge, manager
  let myToken
  let deployer, owner1

  beforeEach(async () => {
    [deployer, owner1] = await ethers.getSigners()

    const Token = await ethers.getContractFactory('MyToken')
    const TokenPledge = await ethers.getContractFactory('CrowedCampaign')
    const Manager = await ethers.getContractFactory('CampaignManager')

    myToken = await Token.deploy()
    manager = await Manager.deploy(myToken.address)
    tokenPledge = await TokenPledge.deploy(myToken.address)
    await tokenPledge.connect(deployer).setGoals([token(3)])
    let transaction = await myToken.connect(deployer).transfer(tokenPledge.address, token(3))
    await transaction.wait()
    transaction = await myToken.connect(deployer).approve(tokenPledge.address, token(3))
    await transaction.wait()
  })
  it('Create a manager of Campaign',async()=>{
    const campaign1 = await manager.connect(deployer).createCampaign('firstTest')
    await campaign1.wait()
    const campaign2 = await manager.connect(deployer).createCampaign('secondTest')
    await campaign2.wait()
    console.log(await manager.campaigns(1))
  })
  it("should be able to deposit funds", async () => {
    const balance = await myToken.balanceOf(tokenPledge.address);
    expect(balance).to.equal(token(3));
  });

  it("should be able to pledge funds", async () => {
    const transaction = await tokenPledge.connect(deployer).deposit(token(2))
    await transaction.wait()

    const balance = await tokenPledge.balances(deployer.address);
    expect(balance).to.equal(token(2));

  });

  it("should be able to refund funds", async () => {
    const transaction = await tokenPledge.connect(deployer).deposit(token(2))
    await transaction.wait()
    const goalReached = await tokenPledge.goalReached();

    expect(goalReached).to.be.equal(false)

    const refund = await tokenPledge.connect(deployer).refund()
    await refund.wait()

    const balance = await tokenPledge.balances(deployer.address);
    expect(balance).to.equal(0);

  });

  it("should be able to reach funding goal", async () => {
    const transaction = await tokenPledge.connect(deployer).deposit(token(3))
    await transaction.wait()

    const goalReached = await tokenPledge.goalReached();
    expect(goalReached).to.be.true
  });

  it("should not be able to refund after reaching funding goal", async () => {
    const transaction = await tokenPledge.connect(deployer).deposit(token(3))
    await transaction.wait()

    try {
      await tokenPledge.connect(deployer).refund()
    } catch (error) {
      expect(error.message).to.include("Goals have been met, no refund available.")
    }
  })
  
})
