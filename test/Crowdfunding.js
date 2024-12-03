const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowdfunding Contract", function () {
    let Crowdfunding, crowdfunding, owner, addr1, addr2;

    beforeEach(async function () {
        // Deploy the contract
        Crowdfunding = await ethers.getContractFactory("Crowdfunding");
        crowdfunding = await Crowdfunding.deploy();
        await crowdfunding.waitForDeployment();

        // Get test accounts
        [owner, addr1, addr2] = await ethers.getSigners();
    });

    it("Should create a new campaign", async function () {
        await crowdfunding.createCampaign(
            "Save the Planet",
            "Help us raise funds for green initiatives",
            ethers.parseEther("10")
        );

        const campaign = await crowdfunding.campaigns(0);

        // Verify campaign details
        expect(campaign.creator).to.equal(await owner.getAddress());
        expect(campaign.title).to.equal("Save the Planet");
        expect(campaign.description).to.equal("Help us raise funds for green initiatives");
        expect(campaign.goal).to.equal(ethers.parseEther("10"));
        expect(campaign.fundsRaised).to.equal(0);
        expect(campaign.completed).to.equal(false);
    });

    it("Should allow contributions to a campaign", async function () {
        await crowdfunding.createCampaign(
            "Save the Planet",
            "Help us raise funds for green initiatives",
            ethers.parseEther("10")
        );

        await crowdfunding.connect(addr1).contribute(0, { value: ethers.parseEther("1") });

        const campaign = await crowdfunding.campaigns(0);
        expect(campaign.fundsRaised).to.equal(ethers.parseEther("1"));
    });

    it("Should prevent withdrawing before goal is met", async function () {
        await crowdfunding.createCampaign(
            "Save the Planet",
            "Help us raise funds for green initiatives",
            ethers.parseEther("10")
        );

        await expect(crowdfunding.withdraw(0)).to.be.revertedWith("Goal not met");
    });

    it("Should allow the creator to withdraw funds after the goal is met", async function () {
        await crowdfunding.createCampaign(
            "Save the Planet",
            "Help us raise funds for green initiatives",
            ethers.parseEther("10")
        );

        // Contribute enough to meet the goal
        await crowdfunding.connect(addr1).contribute(0, { value: ethers.parseEther("10") });

        // Withdraw the funds
        await crowdfunding.withdraw(0);

        const campaign = await crowdfunding.campaigns(0);
        expect(campaign.completed).to.equal(true);
    });

    it("Should prevent non-creators from withdrawing funds", async function () {
        await crowdfunding.createCampaign(
            "Save the Planet",
            "Help us raise funds for green initiatives",
            ethers.parseEther("10")
        );

        // Contribute enough to meet the goal
        await crowdfunding.connect(addr1).contribute(0, { value: ethers.parseEther("10") });

        // Attempt withdrawal by a non-creator
        await expect(crowdfunding.connect(addr1).withdraw(0)).to.be.revertedWith("Only creator can withdraw");
    });

    it("Should prevent contributing to a completed campaign", async function () {
        await crowdfunding.createCampaign(
            "Save the Planet",
            "Help us raise funds for green initiatives",
            ethers.parseEther("10")
        );
    
        // Contribute enough to meet the goal
        await crowdfunding.connect(addr1).contribute(0, { value: ethers.parseEther("10") });
    
        // Withdraw the funds (completing the campaign)
        await crowdfunding.withdraw(0);
    
        // Attempt to contribute to a completed campaign
        await expect(
            crowdfunding.connect(addr1).contribute(0, { value: ethers.parseEther("1") })
        ).to.be.revertedWith("Campaign already completed");
    });
    
    it("Should prevent creating campaigns when paused", async function () {
        // Pause the contract
        await crowdfunding.pause();
    
        // Attempt to create a campaign while paused
        await expect(
            crowdfunding.createCampaign("Test Campaign", "This should fail", ethers.parseEther("5"))
        ).to.be.reverted; // Check that it reverts, regardless of the reason
    });
    
    
});
