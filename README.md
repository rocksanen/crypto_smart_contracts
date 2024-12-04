This project demonstrates a decentralized crowdfunding platform built using Ethereum smart contracts and a simple web-based frontend. It allows users to create campaigns, contribute funds, and check the status of campaigns in a decentralized and transparent way.

# Features

    Create crowdfunding campaigns with a title, description, and funding goal.
    Contribute Ether to active campaigns.
    Check the progress of campaigns, including the funds raised and whether the goal has been met.
    Withdraw funds from successful campaigns (only by the campaign creator).
    Contract functionality protected with advanced security measures (e.g., access control, reentrancy protection).

# Technologies Used

Backend (Smart Contracts)

    Solidity: The Ethereum smart contract language used to write the Crowdfunding contract.
    Hardhat: A development environment for Ethereum used for compiling, testing, and deploying the smart contract.

Frontend

    HTML/CSS: For structuring and styling the user interface.
    JavaScript: For implementing interactions and connecting the frontend to the blockchain.
    Web3.js: A JavaScript library for interacting with Ethereum smart contracts.

Blockchain

    Local Ethereum Node: Powered by Hardhat for local testing and development.

 # Smart Contract

The core of the application is the Crowdfunding smart contract, written in Solidity. It includes the following features:

Campaign Creation

    Users can create campaigns by providing a title, description, and funding goal.
    Campaign creation is restricted to authorized users (using role-based access control).

Contributing to Campaigns

    Users can contribute Ether to active campaigns.
    Contributions are validated to prevent zero-value contributions or contributions to completed campaigns.

Checking Campaign Details

    Users can view campaign details such as funds raised, goal amount, and completion status.

Withdrawing Funds

    Campaign creators can withdraw funds if the campaign goal is met.
    Withdrawals are protected by reentrancy guards and follow the Checks-Effects-Interactions pattern.

# Key Functions in the Smart Contract

Campaign Management

    createCampaign(string _title, string _description, uint256 _goal):
    Creates a new campaign with the provided details and adds it to the list of campaigns.

    getCampaignCount():
    Returns the total number of campaigns.

    campaigns(uint256 _campaignId):
    Fetches details for a specific campaign.

Fund Management

    contribute(uint256 _campaignId):
    Allows users to contribute Ether to a specific campaign.

    withdraw(uint256 _campaignId):
    Lets the campaign creator withdraw funds if the funding goal is met.

# Testing

Unit tests were written using Hardhat to ensure the correctness and security of the smart contract. The key areas tested include:

Campaign Creation

    Verified that campaigns with valid details can be created successfully.
    Ensured that only authorized users can create campaigns.

Contributions

    Confirmed contributions can only be made to valid and active campaigns.
    Verified that funds are correctly tracked and blocked contributions to completed campaigns.

Withdrawals

    Ensured that only campaign creators can withdraw funds and only if the goal is met.
    Tested protection against reentrancy attacks during withdrawals.

Error Handling

    Validated proper reverts for invalid actions, such as contributing to a completed campaign or withdrawing funds prematurely.

Paused State

    Confirmed that all critical functions revert when the contract is paused and resume properly when unpaused.

# Security Features

The project incorporates security measures to ensure the safe handling of funds and prevent vulnerabilities:

1. Input Validation

    Campaigns must have a valid goal greater than 0.
    Contributions must be greater than 0 and only allowed for active campaigns.

2. Role-Based Access Control

    Managed permissions using OpenZeppelin's AccessControl:
        DEFAULT_ADMIN_ROLE: Handles administrative actions like pausing/unpausing the contract.
        CREATOR_ROLE: Assigned to users who can create campaigns.

3. Circuit Breaker Pattern

    Critical functions are paused during emergencies using OpenZeppelin's Pausable contract.
    Applied the whenNotPaused modifier to ensure paused functions cannot be executed.

4. Reentrancy Protection

    Prevented reentrancy attacks by applying OpenZeppelin's ReentrancyGuard to the withdraw function.
    Reentrancy was tested using a malicious contract to ensure security.

5. Checks-Effects-Interactions Pattern

    Followed the CEI pattern in the withdraw function to validate conditions, update state, and transfer funds securely:

        campaign.completed = true; // Mark campaign as completed
        uint256 amount = campaign.fundsRaised;
        campaign.fundsRaised = 0; // Reset funds to prevent reentrancy
        campaign.creator.transfer(amount); // Transfer Ether
        
6. Error Handling

    Implemented meaningful error messages for invalid actions and unauthorized access:
        Example: require(_campaignId < campaigns.length, "Invalid campaign ID");

