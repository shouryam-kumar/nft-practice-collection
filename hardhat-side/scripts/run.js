const { ethers } = require("hardhat")

const main = async () => {
    const nftContractFactory = await ethers.getContractFactory('MyEpicNFT');

    const nftContract = await nftContractFactory.deploy();

    await nftContract.deployed();

    console.log("Contract deployed to: ", nftContract.address);

    let txn = await nftContract.mintNFT()

    await txn.wait();

    //Aaaaahhhhhh/.......I liked this shit. Lets do it again babyyyy
    await nftContract.mintNFT()
    await txn.wait();
}

const runMain = async () => {
    try {
        await main();
        process.exit(0)
    } catch(error) {
        console.error(error);
        process.exit(1);
    }
};


runMain();