const { ethers } = require("hardhat")

const main = async () => {
    const nftContractFactory = await ethers.getContractFactory('MyEpicNFT');

    const nftContract = await nftContractFactory.deploy();

    await nftContract.deployed();

    console.log("Contract deployed to: ", nftContract.address); // 0x5a00c329a457518E71EdC76e8Eb7EFe060eE1Bd3
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