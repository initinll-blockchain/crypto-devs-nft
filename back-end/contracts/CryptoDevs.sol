// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWhitelist.sol";

interface ICryptoDevs {
    function startPresale() external;
    function presaleMint() external payable;
    function postsaleMint() external payable;
    function setPaused(bool isPaused) external;
    function withdraw() external;
}

contract CryptoDevs is ICryptoDevs, ERC721Enumerable, Ownable {
    
    IWhitelist public whitelistContract;

    string private baseTokenURI = "";

    uint256 private mintPrice = 0.01 ether;

    bool private paused = false;
    
    uint256 private maxTokenIdsSupply = 20;
    uint256 private totalTokenIdsMinted = 0;

    bool private presaleStarted = false;
    uint256 private presaleEndDate;

    modifier onlyWhenNotPaused {
        require(!paused, "Contract currently paused");
        _;
    }

    /**
    * @dev ERC721 constructor takes in a `name` and a `symbol` to the token collection.
    * name in our case is `Crypto Devs` and symbol is `CD`.
    * Constructor for Crypto Devs takes in the baseURI to set _baseTokenURI for the collection.
    * It also initializes an instance of whitelist interface.
    */
    constructor (string memory _baseTokenURI, address _whitelistContract) ERC721("Crypto Devs", "CD") {
        baseTokenURI = _baseTokenURI;
        whitelistContract = IWhitelist(_whitelistContract);
    }

    /**
    * @dev startPresale starts a presale for the whitelisted addresses
    */
    function startPresale() public Ownable.onlyOwner {
        presaleStarted = true;
        presaleEndDate = block.timestamp + 5 minutes;
    }

    /**
    * @dev presaleMint allows a user to mint one NFT per transaction during the presale.
    */
    function presaleMint() public payable onlyWhenNotPaused {
        require(presaleStarted && block.timestamp < presaleEndDate, "Presale is not running");
        require(whitelistContract.whitelistedAddresses(msg.sender), "You are not whitelisted");
        require(totalTokenIdsMinted < maxTokenIdsSupply, "Exceeded maximum Crypto Devs supply");
        require(msg.value >= mintPrice, "Ether sent is not correct");

        totalTokenIdsMinted += 1;

        ERC721._safeMint(msg.sender, totalTokenIdsMinted);
    }

    /**
    * @dev mint allows a user to mint 1 NFT per transaction after the presale has ended.
    */
    function postsaleMint() public payable onlyWhenNotPaused {
        require(presaleStarted && block.timestamp >= presaleEndDate, "Presale has not ended yet");
        require(totalTokenIdsMinted < maxTokenIdsSupply, "Exceeded maximum Crypto Devs supply");
        require(msg.value >= mintPrice, "Ether sent is not correct");

        totalTokenIdsMinted += 1;

        ERC721._safeMint(msg.sender, totalTokenIdsMinted);
    }

    /**
    * @dev setPaused makes the contract paused or unpaused
    */
    function setPaused(bool isPaused) public Ownable.onlyOwner {
        paused = isPaused;
    }

    /**
    * @dev withdraw sends all the ether in the contract
    * to the owner of the contract
    */
    function withdraw() public Ownable.onlyOwner {
        address _owner = Ownable.owner();
        uint256 amount = address(this).balance;
        (bool sent,) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    /**
    * @dev _baseURI overides the Openzeppelin's ERC721 implementation which by default
    * returned an empty string for the baseURI
    */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}