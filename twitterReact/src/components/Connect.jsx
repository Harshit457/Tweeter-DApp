import React from "react";
import Web3 from "web3";
import contractABI from "../contracts/main.json";
import profileContractABI from "../contracts/user.json";
const contractAddress = "0xD03ed2100F59eD19819093eDf1bf8618cC71Dc63";
const profileContractAddress = "0xDb17eDFBC8e9b5AAaea0fF0885E3B0f99771727E";
function Connect({
  web3,
  account,
  shortAddress,
  setContract,
  setAccount,
  setProfileContract,
  setWeb3,
}) {
  async function switchToSepolia() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      });
    } catch (error) {
      if (error.code == 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia Test Network",
                rpcUrls: [
                  "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID",
                ],
                nativeCurrency: {
                  name: "Sepolia Ether",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
        } catch (erro2) {
          console.error("Failed to add Sepolia network:", erro2);
        }
      } else {
        console.error("Failed to switch to Sepolia network:", error);
      }
    }
  }

  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const tempWeb3 = new Web3(window.ethereum);
        setWeb3(tempWeb3);
        const networkId = await window.ethereum.request({
          method: "net_version",
        });
        if (networkId !== "11155111") {
          // Network ID for Sepolia is 11155111
          await switchToSepolia();
        }
        const contractInstance = new tempWeb3.eth.Contract(
          contractABI,
          contractAddress
        );
        const profileContractInstance = new tempWeb3.eth.Contract(
          profileContractABI,
          profileContractAddress
        );
        setProfileContract(profileContractInstance);
        console.log("hiiiiii");
        const accounts = await tempWeb3.eth.getAccounts();
        console.log("account", accounts);
        if (accounts.length > 0) {
          setContract(contractInstance);
          setAccount(accounts[0]);
        }
        console.log("naaaah");
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("no web3 provider detected");
    }
  }

  return (
    <div>
      <div className="connect">
        {!account ? (
          <button id="connectWalletBtn" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <div id="userAddress">Connected: {shortAddress(account)}</div>
        )}
      </div>
      <div id="connectMessage">
        {!account ? "Please connect your wallet to tweet." : ""}
      </div>
    </div>
  );
}

export default Connect;
