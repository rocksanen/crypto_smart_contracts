// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";



contract Crowdfunding is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");

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

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CREATOR_ROLE, msg.sender);
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function createCampaign(string memory _title, string memory _description, uint256 _goal)
        public
        whenNotPaused
    {
        require(hasRole(CREATOR_ROLE, msg.sender), "Caller is not a campaign creator");
        require(_goal > 0, "Goal must be greater than 0");
        campaigns.push(Campaign(payable(msg.sender), _title, _description, _goal, 0, false));
    }

    function contribute(uint256 _campaignId) public payable whenNotPaused {
        require(_campaignId < campaigns.length, "Invalid campaign ID");
        Campaign storage campaign = campaigns[_campaignId];
        require(!campaign.completed, "Campaign already completed");
        require(msg.value > 0, "Contribution must be greater than 0");

        campaign.fundsRaised += msg.value;
        contributions[_campaignId][msg.sender] += msg.value;
    }

    function withdraw(uint256 _campaignId) public nonReentrant whenNotPaused {
    require(_campaignId < campaigns.length, "Invalid campaign ID");
    Campaign storage campaign = campaigns[_campaignId];
    require(msg.sender == campaign.creator, "Only creator can withdraw");
    require(!campaign.completed, "Funds already withdrawn"); // Check completion first
    require(campaign.fundsRaised >= campaign.goal, "Goal not met");

    campaign.completed = true; // Mark campaign as completed
    uint256 amount = campaign.fundsRaised;
    campaign.fundsRaised = 0; // Reset fundsRaised after marking as completed
    campaign.creator.transfer(amount); // Transfer funds to the creator
}




    function getCampaignCount() public view returns (uint256) {
        return campaigns.length;
    }

    function getFundsRaised(uint256 _campaignId) public view returns (uint256) {
    require(_campaignId < campaigns.length, "Invalid campaign ID");
    return campaigns[_campaignId].fundsRaised;
}

}   
