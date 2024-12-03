// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    struct Campaign {
        address payable creator;
        string title;
        string description;
        uint256 goal;
        uint256 fundsRaised;
        bool completed;
    }

    Campaign[] public campaigns;

    mapping(uint256 => mapping(address => uint256)) public contributions;

    function createCampaign(string memory _title, string memory _description, uint256 _goal) public {
        require(_goal > 0, "Goal must be greater than 0");
        campaigns.push(Campaign(payable(msg.sender), _title, _description, _goal, 0, false));
    }

    function contribute(uint256 _campaignId) public payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.completed, "Campaign already completed");
        require(msg.value > 0, "Contribution must be greater than 0");

        campaign.fundsRaised += msg.value;
        contributions[_campaignId][msg.sender] += msg.value;
    }

    function withdraw(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Only creator can withdraw");
        require(campaign.fundsRaised >= campaign.goal, "Goal not met");
        require(!campaign.completed, "Funds already withdrawn");

        campaign.completed = true;
        campaign.creator.transfer(campaign.fundsRaised);
    }

    function getCampaignCount() public view returns (uint256) {
        return campaigns.length;
    }
}
