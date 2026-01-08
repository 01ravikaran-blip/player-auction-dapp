// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PlayerAuction {
    // Structs
    struct Player {
        uint256 id;
        string name;
        string position;
        uint256 basePrice;
        address currentClub;
        bool auctioned;
    }

    struct Auction {
        uint256 playerId;
        uint256 startTime;
        uint256 endTime;
        uint256 highestBid;
        address highestBidder;
        bool ended;
        address winner;
    }

    // State variables
    address public admin;
    uint256 public playerCount = 0;
    uint256 public auctionCount = 0;

    mapping(uint256 => Player) public players;
    mapping(uint256 => Auction) public auctions;

    // Events
    event PlayerRegistered(uint256 indexed playerId, string name, string position, uint256 basePrice);
    event AuctionCreated(uint256 indexed auctionId, uint256 indexed playerId, uint256 endTime);
    event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 bidAmount);
    event AuctionEnded(uint256 indexed auctionId, address indexed winner, uint256 winningBid);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Register a new player
    function registerPlayer(
        string memory _name,
        string memory _position,
        uint256 _basePrice
    ) public onlyAdmin returns (uint256) {
        require(bytes(_name).length > 0, "Player name required");
        require(_basePrice > 0, "Base price must be > 0");

        playerCount++;
        uint256 playerId = playerCount;

        players[playerId] = Player({
            id: playerId,
            name: _name,
            position: _position,
            basePrice: _basePrice,
            currentClub: address(0),
            auctioned: false
        });

        emit PlayerRegistered(playerId, _name, _position, _basePrice);
        return playerId;
    }

    // Create an auction for a player
    function createAuction(uint256 _playerId, uint256 _auctionDuration) public onlyAdmin returns (uint256) {
        require(_playerId > 0 && _playerId <= playerCount, "Invalid player ID");
        require(!players[_playerId].auctioned, "Player already in auction");
        require(_auctionDuration > 0, "Auction duration must be > 0");

        players[_playerId].auctioned = true;
        auctionCount++;
        uint256 auctionId = auctionCount;

        uint256 endTime = block.timestamp + _auctionDuration;

        auctions[auctionId] = Auction({
            playerId: _playerId,
            startTime: block.timestamp,
            endTime: endTime,
            highestBid: players[_playerId].basePrice,
            highestBidder: address(0),
            ended: false,
            winner: address(0)
        });

        emit AuctionCreated(auctionId, _playerId, endTime);
        return auctionId;
    }

    // Place a bid on an auction
    function placeBid(uint256 _auctionId) public payable returns (bool) {
        require(_auctionId > 0 && _auctionId <= auctionCount, "Invalid auction ID");
        
        Auction storage auction = auctions[_auctionId];
        require(block.timestamp <= auction.endTime, "Auction has ended");
        require(!auction.ended, "Auction already closed");
        require(msg.value > auction.highestBid, "Bid must be higher than current highest bid");

        // Refund previous highest bidder
        if (auction.highestBidder != address(0)) {
            (bool success, ) = payable(auction.highestBidder).call{value: auction.highestBid}("");
            require(success, "Refund failed");
        }

        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        emit BidPlaced(_auctionId, msg.sender, msg.value);
        return true;
    }

    // End an auction and transfer player to winner
    function endAuction(uint256 _auctionId) public onlyAdmin returns (bool) {
        require(_auctionId > 0 && _auctionId <= auctionCount, "Invalid auction ID");
        
        Auction storage auction = auctions[_auctionId];
        require(block.timestamp >= auction.endTime, "Auction still ongoing");
        require(!auction.ended, "Auction already ended");

        auction.ended = true;

        if (auction.highestBidder != address(0)) {
            uint256 playerId = auction.playerId;
            players[playerId].currentClub = auction.highestBidder;
            players[playerId].auctioned = false;
            auction.winner = auction.highestBidder;

            emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid);
        } else {
            players[auction.playerId].auctioned = false;
            emit AuctionEnded(_auctionId, address(0), 0);
        }

        return true;
    }

    // Get player details
    function getPlayer(uint256 _playerId) public view returns (Player memory) {
        require(_playerId > 0 && _playerId <= playerCount, "Invalid player ID");
        return players[_playerId];
    }

    // Get auction details
    function getAuction(uint256 _auctionId) public view returns (Auction memory) {
        require(_auctionId > 0 && _auctionId <= auctionCount, "Invalid auction ID");
        return auctions[_auctionId];
    }

    // Get all players
    function getPlayerList(uint256 _limit) public view returns (Player[] memory) {
        uint256 count = _limit < playerCount ? _limit : playerCount;
        Player[] memory playerList = new Player[](count);

        for (uint256 i = 1; i <= count; i++) {
            playerList[i - 1] = players[i];
        }
        return playerList;
    }

    // Withdraw funds (for admin)
    function withdraw() public {
        require(msg.sender == admin, "Only admin can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = payable(admin).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // Fallback to receive ETH
    receive() external payable {}
}
