// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.esm.min.js";
import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.5.4.esm.min.js";
const DESTINATION_ADDRESS = "0x0000000000000000000000000000000000000000";
const { parseEther } = ethers.utils;
let eth = window.ethereum;
let multipliers = [1, 5, 10];
let account = localStorage.getItem("account");
if (account) {
  Account(account);
}
const connectButton = document.getElementById("connect");
connectButton.addEventListener("click", async () => {
  // Will Open the MetaMask UI
  // You should disable this button while the request is pending!
  console.log("connect", eth);
  console.log("account", eth.selectedAddress);
  console.log(
    eth
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        console.log("accounts", accounts);
        account = accounts[0];
        if (account) {
          Account(account);
          localStorage.setItem("account", account);
        } else {
          localStorage.removeItem("account");
        }
      })
      .catch((error) => {
        console.error(error);
      })
  );
});
if (eth) {
  if (eth.isMetaMask) {
    // MetaMask is installed

    eth.on("accountsChanged", function (accounts) {
      // Time to reload your interface with accounts[0]!
      account = accounts[0];
      Account(account);
      localStorage.setItem("account", account);
      console.log(accounts);
    });
    eth.on("chainChanged", function (chainId) {
      console.log(chainId);
    });
    eth.on("disconnect", function (error) {
      console.log(error);
      localStorage.removeItem("account");
      account = null;
      Account(account);
    });
    eth.on("message", function (payload) {
      console.log("message", payload);
    });
    eth.on("connect", function ({ chainId }) {
      console.log(chainId);
      console.log(account);
      SetupButtons();
    });
    console.log(eth.chainId);
    SetupButtons();
  } else {
    console.log("not supported");
  }
} else {
  console.log("No ethereum provider found");
  let interval = setInterval(() => {
    eth = window.ethereum;
    if (eth) {
      clearInterval(interval);
    }
  }, 1000);
}

function Account(account) {
  let accountUI = document.getElementById("account");
  if (!accountUI) {
    accountUI = document.createElement("div");
    accountUI.id = "account";
    document.body.appendChild(accountUI);
  }
  accountUI.innerText = account ?? "No account";
}

function SetupButtons() {
  if (account) {
    multipliers.forEach((multiplier) => {
      const ether = 0.05 * multiplier;
      const amount = parseEther(ether.toString());
      const id = `send-x${multiplier}`;
      let sendButton = document.getElementById(id);
      if (!sendButton) {
        sendButton = document.createElement("button");
        sendButton.id = id;
        sendButton.innerText = "Mint x " + multiplier;
        document.body.appendChild(sendButton);
      }
      sendButton.addEventListener("click", async () => {
        console.log(
          eth
            .request({
              method: "eth_sendTransaction",
              params: [
                {
                  from: eth.selectedAddress,
                  to: DESTINATION_ADDRESS,
                  value: amount.toHexString(),
                },
              ],
            })
            .then((txHash) => console.log(txHash))
            .catch((error) => console.error)
        );
      });
    });
  } else {
    // ping the user to connect
    // alert('Please connect your wallet')
    console.log("Please connect your wallet");
  }
}
