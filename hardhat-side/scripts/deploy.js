const { ethers } = require("hardhat")

const main = async () => {
    const nftContractFactory = await ethers.getContractFactory('MyEpicNFT');

    const nftContract = await nftContractFactory.deploy();

    await nftContract.deployed();

    console.log("Contract deployed to: ", nftContract.address); // 0x5FbDB2315678afecb367f032d93F642f64180aa3
    // let txn = await nftContract.mintNFT()
    // await txn.wait();
    // console.log("minted nft #1")

    // //Aaaaahhhhhh/.......I liked this shit. Lets do it again babyyyy
    // await nftContract.mintNFT()
    // await txn.wait();
    // console.log("minted nft #2")
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
};


runMain();