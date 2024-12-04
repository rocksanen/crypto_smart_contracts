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

// CSRF Token (mocked here for simplicity)
const csrfToken = "123456789ABCDEF";

// Secure Input Validation
function validateInput(input) {
    const sanitizedInput = input.replace(/<[^>]*>?/gm, ''); // Strip HTML tags
    if (!sanitizedInput || sanitizedInput.trim().length === 0) {
        throw new Error('Invalid input');
    }
    return sanitizedInput.trim();
}

// Create Campaign with Validation
async function validateAndSubmitCampaign() {
  try {
      const title = validateInput(document.getElementById("title").value);
      const description = validateInput(document.getElementById("description").value);
      const goal = parseFloat(document.getElementById("goal").value);

      if (isNaN(goal) || goal <= 0) {
          throw new Error('Goal must be a positive number');
      }

      const accounts = await web3.eth.getAccounts();
      await contract.methods.createCampaign(title, description, web3.utils.toWei(goal.toString(), "ether"))
          .send({ from: accounts[0] });

      alert("Campaign created successfully!");
      return false;
  } catch (error) {
      alert("Error: " + error.message);
      return false;
  }
}

// Contribute with Validation
async function validateAndSubmitContribution() {
  try {
      const campaignId = parseInt(document.getElementById("campaignId").value);
      const amount = parseFloat(document.getElementById("amount").value);

      if (isNaN(campaignId) || campaignId < 0 || isNaN(amount) || amount <= 0) {
          throw new Error('Invalid campaign ID or amount');
      }

      const accounts = await web3.eth.getAccounts();
      await contract.methods.contribute(campaignId)
          .send({ from: accounts[0], value: web3.utils.toWei(amount.toString(), "ether") });

      alert("Contribution successful!");
      return false;
  } catch (error) {
      alert("Error: " + error.message);
      return false;
  }
}

// Check Funds
async function checkFunds() {
  try {
      const campaignId = parseInt(document.getElementById("campaignIdCheck").value);
      const campaign = await contract.methods.campaigns(campaignId).call();
      document.getElementById("fundsRaised").innerText = `Funds Raised: ${web3.utils.fromWei(campaign.fundsRaised, "ether")} ETH`;
  } catch (error) {
      alert("Error: " + error.message);
  }
}

// List all campaigns with proper handling
async function listCampaigns() {
  try {
      console.log("listCampaigns button clicked");

      const totalCampaigns = parseInt(await contract.methods.getCampaignCount().call());
      if (isNaN(totalCampaigns) || totalCampaigns < 0) {
          throw new Error("Invalid campaign count retrieved");
      }

      const container = document.getElementById("campaigns-container");
      container.innerHTML = ""; // Clear previous campaigns

      // Limit campaigns displayed to prevent UI overloading (e.g., max 100 campaigns at a time)
      const maxCampaignsToDisplay = 100;
      const campaignsToDisplay = Math.min(totalCampaigns, maxCampaignsToDisplay);

      for (let i = 0; i < campaignsToDisplay; i++) {
          const campaign = await contract.methods.campaigns(i).call();
          const sanitizedTitle = campaign.title.replace(/<[^>]*>?/gm, ''); // Sanitize output
          const sanitizedDescription = campaign.description.replace(/<[^>]*>?/gm, '');

          const campaignDiv = document.createElement("div");
          campaignDiv.className = "box"; // Add a Bulma box style
          campaignDiv.innerHTML = `
              <p><strong>ID:</strong> ${i}</p>
              <p><strong>Title:</strong> ${sanitizedTitle}</p>
              <p><strong>Description:</strong> ${sanitizedDescription}</p>
              <p><strong>Goal:</strong> ${web3.utils.fromWei(campaign.goal, "ether")} ETH</p>
              <p><strong>Funds Raised:</strong> ${web3.utils.fromWei(campaign.fundsRaised, "ether")} ETH</p>
              <p><strong>Completed:</strong> ${campaign.completed ? "Yes" : "No"}</p>
          `;
          container.appendChild(campaignDiv);
      }
  } catch (error) {
      alert("Error: " + error.message);
  }
}


// Withdraw funds with proper validation
async function withdraw() {
  try {
      console.log("withdraw button clicked");

      const campaignId = parseInt(document.getElementById("campaignWithdraw").value);

      // Validate campaign ID
      if (isNaN(campaignId) || campaignId < 0) {
          throw new Error("Invalid campaign ID");
      }

      const accounts = await web3.eth.getAccounts();

      // Attempt to withdraw funds
      await contract.methods.withdraw(campaignId).send({ from: accounts[0] });

      alert("Withdrawal successful!");
  } catch (error) {
      alert("Error: " + error.message);
  }
}


// Attach all functions to the global scope
window.createCampaign = createCampaign;
window.contribute = contribute;
window.checkFunds = checkFunds;
window.listCampaigns = listCampaigns;
