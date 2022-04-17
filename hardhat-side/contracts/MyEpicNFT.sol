//SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import {Base64} from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    string baseSvg =
        "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='00 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%'height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle'text-anchor='middle'>";

    //arrays for the random names

    string[] firstWords = [
        "Shouryam ",
        "Awantika ",
        "Siddarth ",
        "Aryan ",
        "Dinki ",
        "Diksha ",
        "Prtayush ",
        "Varsha ",
        "Hrishish "
    ];
    string[] secondWords = ["Is A "];
    string[] thirdWords = [
        "Chimpanzee",
        "Gorilla",
        "Langoor",
        "Orangutan",
        "Macaque",
        "Cockroach",
        "Kaala Keeda",
        "Bilauta"
    ];


    event NewEpicNFTMinted(address sender, uint256 tokenId);

    //function to randomly select the first words

    function pickRandomFirstWord(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId)))
        );

        //to avoid getting out of bound errors, we divide the total rand int with the length of the string array
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    //function to randomly select the third words

    function pickRandomThirdWord(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        uint256 rand = random(
            string(abi.encodePacked("Third_WORD", Strings.toString(tokenId)))
        );

        //to avoid getting out of bound errors, we divide the total rand int with the length of the string array
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    constructor() ERC721("ShouryamNFT", "SHO") {
        console.log("This is my NFT contract, woaaaahhhh!!!!!!");
    }

    function mintNFT() public {
        uint256 newItemId = _tokenIds.current();

        require(newItemId <= 50, "The maximum minting limit has been achieved. We hope to see you soon again");

        //we go and grap one word randomly from each of the arays

        string memory first = pickRandomFirstWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);
        string memory combinedWord = string(
            abi.encodePacked(first, secondWords[0], third)
        );

        //Concatenating it all together, and then close the <text> and <svg> tags
        string memory finalSvg = string(
            abi.encodePacked(baseSvg, combinedWord, "<text></svg>")
        );

        //Get all the JSON metadata in the place an d base64 encode it

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        // We set the title of our NFT as the generated word.
                        combinedWord,
                        '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
                        // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(abi.encodePacked("data:application/json;base64,", json));

        console.log("\n--------------------");
        console.log(finalTokenUri);
        console.log("--------------------\n");

        _safeMint(msg.sender, newItemId);

        //Set the NFT data

        _setTokenURI(newItemId, finalTokenUri);

        console.log(
            "An NFT with ID %s has been minted to %s",
            newItemId,
            msg.sender
        );

        //Increment the token id for teh next item

        _tokenIds.increment();
        emit NewEpicNFTMinted(msg.sender, newItemId);
    }
}
