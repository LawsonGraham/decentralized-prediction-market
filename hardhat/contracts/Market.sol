// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
contract Triumph {
    uint256 private _betIds;
    address private owner;
    address[] mintedNFTs;
    mapping (uint256 => Bet) private allBets;
    mapping (uint256 => mapping (address => bool)) private betToValidNFTs;
    struct Bet {
        string eventName;
        uint256 startTime;
        uint256 endTime;
        uint256 option1Odds;
        uint256 option2Odds;
        uint256 option1Shares;
        uint256 option2Shares;
        bool winner;
        string coverimglink;
        uint id;
    }
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    constructor() {
        owner = msg.sender;
        _betIds = 0;
    }    
    function newBet(string memory _eventName, uint256 _startTime, uint256 _endTime, uint256 _option1Odds, uint256 _option2Odds, string memory _coverimglink) public payable onlyOwner {
        require (_option1Odds + _option2Odds == 1000, "Imbalanced odds");
        allBets[_betIds] = Bet(
            {
                eventName: _eventName,
                startTime: _startTime,
                endTime: _endTime,
                option1Odds: _option1Odds,
                option2Odds: _option2Odds,
                option1Shares: _option1Odds * (10**16),
                option2Shares: _option2Odds * (10**16),
                winner: false,
                coverimglink: _coverimglink,
                id: _betIds
            }
        );
        _betIds++;
    }
    
    function makeBet(bool _betChoice, uint256 _betId) public payable {
        Bet memory _bet = allBets[_betId];
        require(block.timestamp > _bet.startTime);  //bet has started
        // require(_bet.endTime > block.timestamp);    //bet hasn't ended
        require(msg.value > 1 * (10**16));          //minimum bet of 0.01 ETH
        
        if (_betChoice) {   //increases shares of bet choice
            _bet.option1Shares += msg.value;
        } else {
            _bet.option2Shares += msg.value;
        }
        BetNFT newNFT = new BetNFT(_betId, msg.value, _betChoice, msg.sender, allBets[_betId].coverimglink, allBets[_betId].eventName, allBets[_betId].endTime);  //deploys NFT for bet
        betToValidNFTs[_betId][address(newNFT)] = true;     //records NFT as a valid bet
        mintedNFTs.push(address(newNFT));
        _bet.option1Odds = (_bet.option1Shares * 1000) / (_bet.option1Shares + _bet.option2Shares);
        _bet.option2Odds = (_bet.option2Shares * 1000) / (_bet.option1Shares + _bet.option2Shares);
    }

    function claimWinnings(uint256 _betId, address NFTaddress) public {
        Bet memory _bet = allBets[_betId];
        // require(_bet.endTime < block.timestamp);
        require(betToValidNFTs[_betId][NFTaddress]);
        BetNFT betCheck = BetNFT(NFTaddress);
        uint256 betTotal = betCheck.getShares();
        if (_bet.winner) {                      //if that bet won
            if (betCheck.getOption()) {         //if user selected that option
                payable(msg.sender).transfer((_bet.option1Shares + _bet.option2Shares) * (betTotal / _bet.option1Shares));
            }
        } else {
            if (!betCheck.getOption()) {
                payable(msg.sender).transfer((_bet.option1Shares + _bet.option2Shares) * (betTotal / _bet.option2Shares));
            }
        }
    }

    function setWinnerTrue(uint256 _betID) public onlyOwner {
        allBets[_betID].winner = true;
    }
    
    function getBet(uint256 _betId) public view returns (Bet memory) {
        return allBets[_betId];
    }
    function getCurrentId() public view returns (uint256) {
        return _betIds;
    }
    function checkOwner() public view returns (bool) {
        return owner == msg.sender;
    }
    function getAllNFTs() public view returns (address[] memory) {
        return mintedNFTs;
    }
}

contract BetNFT is ERC721{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 private betID;
    uint256 private shares;
    string eventName;
    uint256 endDate;
    string imgURL;
    bool private option;
    address private ownerAddress;
    constructor(uint256 _betID, uint256 _shares, bool _option, address _minter, string memory _eventName, string memory _imgURL, uint256 _endDate) ERC721("Triumph Bet NFT", "TBNFT") {
        betID = _betID;
        shares = _shares;
        option = _option;
        eventName = _eventName;
        imgURL = _imgURL;
        endDate = _endDate;
        ownerAddress = _minter;
        _tokenIds.increment();
        _mint(_minter, _tokenIds.current());
    }
    function getID() public view returns (uint256) {
        return betID;
    }
    function getOption() public view returns (bool) {
        return option;
    }
    function getShares() public view returns (uint256) {
        return shares;
    }
    function getOwner() public view returns (address) {
        return ownerAddress;
    }
    function getName() public view returns (string memory) {
        return eventName;
    }
    function getImgUrl() public view returns (string memory) {
        return imgURL;
    }
    function getEndDate() public view returns (uint) {
        return endDate;
    }
}