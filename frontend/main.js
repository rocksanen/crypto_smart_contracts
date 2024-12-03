const web3 = new Web3("http://127.0.0.1:8545");

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = [
    {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "campaigns",
        "outputs": [
          {
            "internalType": "address payable",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "goal",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fundsRaised",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "completed",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_campaignId",
            "type": "uint256"
          }
        ],
        "name": "contribute",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "contributions",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_goal",
            "type": "uint256"
          }
        ],
        "name": "createCampaign",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getCampaignCount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_campaignId",
            "type": "uint256"
          }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Create a new campaign
async function createCampaign() {
    console.log("createCampaign button clicked");
    const accounts = await web3.eth.getAccounts();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const goal = web3.utils.toWei(document.getElementById("goal").value, "ether");

    await contract.methods
        .createCampaign(title, description, goal)
        .send({ from: accounts[0] });

    const totalCampaigns = await contract.methods.getCampaignCount().call();
    const latestCampaignId = totalCampaigns - BigInt(1);
    alert(`Campaign created successfully! ID: ${latestCampaignId.toString()}`);
}

// Contribute to a campaign
async function contribute() {
    console.log("contribute button clicked");
    const accounts = await web3.eth.getAccounts();
    const campaignId = document.getElementById("campaignId").value;
    const amount = web3.utils.toWei(document.getElementById("amount").value, "ether");

    await contract.methods.contribute(campaignId).send({ from: accounts[0], value: amount });
    alert("Contribution successful!");
}

// Check funds raised for a campaign
async function checkFunds() {
    console.log("checkFunds button clicked");
    const campaignId = document.getElementById("campaignIdCheck").value;
    const campaign = await contract.methods.campaigns(campaignId).call();

    document.getElementById("fundsRaised").innerText = `Funds Raised: ${web3.utils.fromWei(
        campaign.fundsRaised,
        "ether"
    )} ETH`;
}

// List all campaigns
async function listCampaigns() {
    console.log("listCampaigns button clicked");
    const totalCampaigns = await contract.methods.getCampaignCount().call();
    const container = document.getElementById("campaigns-container");
    container.innerHTML = ""; // Clear previous campaigns

    for (let i = 0; i < totalCampaigns; i++) {
        const campaign = await contract.methods.campaigns(i).call();
        const campaignDiv = document.createElement("div");
        campaignDiv.className = "box"; // Add a Bulma box style
        campaignDiv.innerHTML = `
            <p><strong>ID:</strong> ${i}</p>
            <p><strong>Title:</strong> ${campaign.title}</p>
            <p><strong>Description:</strong> ${campaign.description}</p>
            <p><strong>Goal:</strong> ${web3.utils.fromWei(campaign.goal, "ether")} ETH</p>
            <p><strong>Funds Raised:</strong> ${web3.utils.fromWei(campaign.fundsRaised, "ether")} ETH</p>
            <p><strong>Completed:</strong> ${campaign.completed ? "Yes" : "No"}</p>
        `;
        container.appendChild(campaignDiv);
    }
}

// Attach all functions to the global scope
window.createCampaign = createCampaign;
window.contribute = contribute;
window.checkFunds = checkFunds;
window.listCampaigns = listCampaigns;
