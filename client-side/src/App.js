import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNFT from "./utils/MyEpicNFT.json";

// Constants
const TWITTER_HANDLE = "shouryamK";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0xc0D3139a53b31abB19DABDc5D29c473C9D770D21";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentMinted, setCurrentMinted] = useState(0);

  const checkIfWalletIsConnected = async () => {
    if (window.ethereum === undefined) {
      console.log("Make sure you have metamask connected");
    } else {
      console.log("We are good to go!!!");
    }

    //check if the account is rinkeby

    let chainId = await window.ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }

    //Check if we are authorized to access the user's wallet
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", accounts[0]);
      setCurrentAccount(account);

      setupEventListener();
    } else {
      console.log("No authorized account found");
    }
  };

  //Connect Wallet

  const connectWallet = async () => {
    try {
      if (window.ethereum === undefined) {
        alert("Get Metamask");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      setupEventListener();
    } catch (err) {
      console.log(err);
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  //setup event listener

  const setupEventListener = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS, myEpicNFT.abi,
          signer
        );

        //This will capture the whole event when our contract throws it off
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (err) {
      console.error(err);
    }

    console.log("Setup event listener");
  };

  const mintStatus = () => {
    if (currentMinted < 50) {
      setCurrentMinted(currentMinted + 1);
    } else {
      console.log("Bawaal Hogya!!");
    }
  };

  const askContractToMintNft = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNFT.abi,
          signer
        );

        console.log("Going to pop up wallet to pay gas now");
        let nftTxn = await connectedContract.mintNFT();

        console.log("Minning.... please wait!");

        await nftTxn.wait();

        console.log(
          `Mined, see transaction : https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );

        mintStatus();
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  },);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button
              onClick={askContractToMintNft}
              className="cta-button connect-wallet-button"
            >
              Mint NFT
            </button>
          )}
        </div>

        <div className="container">
          <p className="sub-text">{currentMinted} / 50 MINTED</p>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
