This project demonstrates a decentralized crowdfunding platform built using Ethereum smart contracts and a simple web-based frontend. It allows users to create campaigns, contribute funds, and check the status of campaigns in a decentralized and transparent way.

# Features

    Create crowdfunding campaigns with a title, description, and funding goal.
    Contribute Ether to active campaigns.
    Check the progress of campaigns, including the funds raised and whether the goal has been met.
    Withdraw funds from successful campaigns (only by the campaign creator).

# Technologies Used

Backend (Smart Contracts)

    Solidity: The Ethereum smart contract language used to write the Crowdfunding contract.
    Hardhat: A powerful development environment for Ethereum used for compiling, testing, and deploying the smart contract.

Frontend

    HTML/CSS: For structuring and styling the user interface.
    JavaScript: For implementing interactions and connecting the frontend to the blockchain.
    Web3.js: A JavaScript library for interacting with Ethereum smart contracts.

Blockchain

    Local Ethereum Node: Powered by Hardhat for local testing and development.

 # Smart Contract

The core of the application is the Crowdfunding smart contract, written in Solidity. It includes the following features:

    Campaign Creation:
        Users can create campaigns by providing a title, description, and funding goal.
    Contributing to Campaigns:
        Users can contribute Ether to active campaigns.
    Checking Campaign Details:
        View campaign details such as funds raised, goal amount, and completion status.
    Withdrawing Funds:
        Campaign creators can withdraw funds if the campaign goal is met.

# Key Functions in the Smart Contract

    createCampaign(string _title, string _description, uint256 _goal)
        Creates a new campaign with the provided details.
        Adds the campaign to the list of campaigns.

    contribute(uint256 _campaignId)
        Allows users to contribute Ether to a specific campaign.

    withdraw(uint256 _campaignId)
        Lets the campaign creator withdraw funds if the funding goal is met.

    getCampaignCount()
        Returns the total number of campaigns.

    campaigns(uint256 _campaignId)
        Fetches details for a specific campaign.

# Project Structure

crowdfunding-dapp/
├── contracts/
│   ├── Crowdfunding.sol       # The Solidity smart contract
│   └── Lock.sol               # Example boilerplate contract (not used)
├── frontend/
│   ├── index.html             # Main frontend file
│   ├── main.js                # Frontend JavaScript logic
│   └── styles.css             # Frontend styling
├── scripts/
│   └── deploy.js              # Script to deploy the smart contract
├── test/
│   ├── Crowdfunding.js        # Unit tests for the Crowdfunding contract
│   └── Lock.js                # Example boilerplate test (not used)
├── hardhat.config.js          # Hardhat configuration file
├── package.json               # Node.js dependencies and scripts
├── package-lock.json          # Locked dependency tree
└── README.md                  # Project documentation
