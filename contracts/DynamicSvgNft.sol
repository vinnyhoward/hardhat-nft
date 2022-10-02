// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";
import "hardhat/console.sol";

// TODO: Desired flow
// Mint
// Store our SVG info somewhere
// Some logic to say "show X Image" or "show Y image"
error DynamicSvgNft__YouRequireMoreMinerals(uint256 sent, uint256 required);

contract DynamicSvgNft is ERC721 {
    uint256 private immutable i_mintFee;
    uint256 private s_tokenCounter;
    string private i_lowImageUri;
    string private i_highImageUri;

    mapping(uint256 => int256) private s_tokenIdToHighValues;

    event CreatedNFT(uint256 indexed tokenId, int256 highValue);

    constructor(
        uint256 mintFee,
        string memory lowSvg,
        string memory highSvg
    ) ERC721("Dynamic SVG NFT", "DSN") {
        s_tokenCounter = 0;
        i_mintFee = mintFee;
    }

    function svgToImageURI(string memory svg) public pure returns (string memory) {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }

    function mint() public payable {
        if (msg.value < i_mintFee) {
            revert DynamicSvgNft__YouRequireMoreMinerals({sent: msg.value, required: i_mintFee});
        }

        _safeMint(msg.sender);
        s_tokenCounter = s_tokenCounter + 1;
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    // TODO: Bonus function: Override ERC721 transfer to update mapping
}
