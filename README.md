# 🏆 Player Auction DApp

A **decentralized blockchain-based player auction platform** built on Ethereum (Sepolia testnet) using smart contracts and a modern React frontend. Buy and sell sports players transparently through transparent, immutable auctions.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [How to Use](#how-to-use)
- [User Roles](#user-roles)
- [Smart Contract Functions](#smart-contract-functions)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

The **Player Auction DApp** is a Web3 application that enables:
- **Admin**: Register players and create auctions with custom durations
- **Bidders**: Participate in live auctions by placing bids in ETH
- **Transparency**: All transactions recorded on-chain (Sepolia testnet)
- **Security**: Smart contract ensures fair bidding, refunds, and winner determination

This is ideal for:
- Fantasy football leagues
- Sports management platforms
- Decentralized player trading systems
- NFT-based athlete marketplaces

---

## ✨ Features

### For Admins
✅ Register new players (name, position, base price)  
✅ Create time-locked auctions  
✅ End auctions manually (if timer expires)  
✅ View all registered players and active auctions  

### For Bidders
✅ View all active auctions in real-time  
✅ Place competitive bids in ETH  
✅ Automatic refunds if outbid  
✅ See auction status, highest bidder, and time remaining  

### For All Users
✅ Connect MetaMask wallet  
✅ Real-time auction updates (5-second refresh)  
✅ Clear success/error messages  
✅ Responsive UI for desktop and mobile  

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| **Blockchain** | Ethereum (Sepolia Testnet) |
| **Smart Contract** | Solidity 0.8.31 |
| **Frontend Framework** | React 18 + Vite |
| **Web3 Library** | ethers.js v6.x |
| **Wallet Integration** | MetaMask |
| **Styling** | CSS3 (custom) |
| **State Management** | React Hooks (useState, useEffect) |

---

## 📦 Prerequisites

Before you start, ensure you have:

1. **Node.js & npm**  
   - [Download Node.js](https://nodejs.org/) (v16 or higher)
   - Verify: `node -v` and `npm -v`

2. **MetaMask Wallet**  
   - [Install MetaMask Extension](https://metamask.io/)
   - Create or import an account

3. **Sepolia ETH (Testnet)**  
   - Get free Sepolia ETH from a faucet:
     - [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum)
     - [Infura Faucet](https://www.infura.io/faucet/sepolia)
   - Add ~0.5 ETH to your account for testing

4. **Deployed Smart Contract**  
   - Contract address on Sepolia
   - Contract ABI (JSON file)

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/player-auction-dapp.git
cd player-auction-dapp
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Contract Details

Create or update `src/config.js`:
```javascript
export const CONTRACT_ADDRESS = "0xYourContractAddressHere";
export const CONTRACT_ABI = [
  // Paste your contract ABI here
  // (Get it from Etherscan or your deployment script)
];
```

**How to get the ABI:**
- If deployed via Hardhat/Truffle: Find in `artifacts/` folder
- If deployed on Etherscan: Go to contract page → "Code" tab → Copy ABI

### Step 4: Start the Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173/`

### Step 5: Connect Your Wallet
1. Click **"🔌 Connect MetaMask"** button
2. Approve the connection in MetaMask
3. Make sure you're on **Sepolia Testnet** (switch in MetaMask dropdown)
4. You're ready to go!

---

## 📖 How to Use

### As an Admin (Contract Deployer)

#### 1. Register a Player
```
Section: "⚙️ Admin Controls"
Card: "📝 Register Player"

Steps:
  1. Enter player name (e.g., "Cristiano Ronaldo")
  2. Enter position (e.g., "Forward")
  3. Enter base price in ETH (e.g., 0.5)
  4. Click "✅ Register" button
  5. Confirm transaction in MetaMask
  6. Wait for confirmation (usually 12-30 seconds)
```

**What happens:**
- Player is added to the on-chain list
- Player status is "🟢 Available"
- Can now create auctions for this player

#### 2. Create an Auction
```
Section: "⚙️ Admin Controls"
Card: "🎯 Create Auction"

Steps:
  1. Enter Player ID (view in "Registered Players" section)
  2. Enter duration in seconds (e.g., 600 = 10 minutes)
  3. Click "✅ Create" button
  4. Confirm transaction in MetaMask
  5. Wait for confirmation
```

**What happens:**
- Auction is created with a countdown timer
- Player status changes to "🔴 In Auction"
- Highest bid starts at base price
- Bidders can now place bids

#### 3. End an Auction
```
Section: "🏅 Active Auctions"
Card: "Active" auction card

Steps:
  1. Wait for timer to expire OR click "🔚 End Auction"
  2. Confirm transaction in MetaMask
```

**What happens:**
- Auction status changes to "✓ Ended"
- Winner receives the player
- Highest bidder's ETH is locked
- All other bidders get refunded automatically

---

### As a Bidder

#### 1. Browse Active Auctions
```
Section: "🏅 Active Auctions"

View:
  - Player name & position
  - Current highest bid in ETH
  - Auction countdown timer
  - Winner (if ended)
```

#### 2. Place a Bid
```
Steps:
  1. Find an active auction (status: "⏱ Active")
  2. Enter your bid amount in ETH (must be > current highest bid)
  3. Click "💰 Place Bid"
  4. Confirm transaction in MetaMask
  5. Wait for confirmation
```

**Important:**
- Your bid must be **higher than the current highest bid**
- You need enough Sepolia ETH in MetaMask (bid amount + gas)
- If outbid, your ETH is automatically refunded
- You can bid multiple times

#### 3. Win an Auction
```
When auction ends:
  - If you're the highest bidder:
    ✓ Your name appears as "Winner"
    ✓ You own the player
    ✓ Your bid amount is locked (not refunded)
  
  - If you didn't win:
    ✓ Your bid is refunded to your wallet
    ✓ You can bid in other auctions
```

---

## 👥 User Roles

| Role | Permissions |
|------|------------|
| **Admin** | Register players, create auctions, end auctions, withdraw funds |
| **Bidder** | Place bids, view auctions, check bid history |
| **Visitor** | View auction info (no wallet connected) |

---

## 📝 Smart Contract Functions

### Admin Functions

#### `registerPlayer(string name, string position, uint256 basePrice)`
Register a new player for auctions.

```
Parameters:
  - name: Player's name (e.g., "Messi")
  - position: Player's position (e.g., "Forward")
  - basePrice: Starting bid in wei (use ethers.parseEther("0.5"))

Returns:
  - Player ID (auto-incremented)
```

#### `createAuction(uint256 playerId, uint256 duration)`
Create an auction for a registered player.

```
Parameters:
  - playerId: ID of player to auction
  - duration: Auction length in seconds

Returns:
  - Auction ID (auto-incremented)
```

#### `endAuction(uint256 auctionId)`
Close an auction and finalize the winner.

```
Parameters:
  - auctionId: ID of auction to end

Note:
  - Can only be called after duration expires
  - Automatically transfers player to winner
```

### Public Functions

#### `placeBid(uint256 auctionId)`
Place a bid on an active auction (payable function).

```
Parameters:
  - auctionId: ID of auction to bid on

Send Value (msg.value):
  - Bid amount in wei (use ethers.parseEther("0.1"))

Requirements:
  - Auction must be active (not ended)
  - Bid must be > current highest bid
  - Bidder must have sufficient ETH
```

#### `getAuction(uint256 auctionId)`
Retrieve auction details.

```
Returns:
  {
    id: Auction ID,
    playerId: Associated player ID,
    startTime: Auction creation timestamp,
    duration: Auction duration in seconds,
    highestBid: Current highest bid amount,
    highestBidder: Address of highest bidder,
    ended: Auction status (true/false),
    winner: Address of final winner
  }
```

#### `getPlayer(uint256 playerId)`
Retrieve player details.

```
Returns:
  {
    id: Player ID,
    name: Player name,
    position: Player position,
    basePrice: Starting bid amount,
    auctioned: Currently in auction (true/false),
    owner: Current owner address
  }
```

---

## ❌ Troubleshooting

### MetaMask Not Connecting
- ✅ Ensure MetaMask extension is installed
- ✅ Switch to **Sepolia Testnet** in MetaMask
- ✅ Refresh the page
- ✅ Clear browser cache

### "Insufficient Funds" Error
- ✅ Check Sepolia ETH balance in MetaMask
- ✅ Get more ETH from [faucet](https://www.alchemy.com/faucets/ethereum)
- ✅ Allow 2-3 minutes for faucet to send funds

### Bid Fails with "Higher Than Current Bid" Error
- ✅ View the current highest bid on the auction card
- ✅ Enter a bid **strictly greater** than that amount
- ✅ Ensure account has sufficient balance

### Transaction Takes Too Long
- ✅ Network may be congested
- ✅ Wait 2-3 minutes
- ✅ Check status on [Sepolia Etherscan](https://sepolia.etherscan.io/)

### Page Shows Blank Screen After Auction
- ✅ Null values are being displayed without guards
- ✅ Try refreshing the page
- ✅ Clear MetaMask cache

### Contract Address Invalid
- ✅ Verify contract address in `src/config.js`
- ✅ Ensure it's a Sepolia address, not mainnet
- ✅ Check contract exists on [Sepolia Etherscan](https://sepolia.etherscan.io/)

---

## 📂 Project Structure

```
player-auction-dapp/
├── src/
│   ├── App.jsx           # Main React component
│   ├── App.css           # Styling
│   ├── config.js         # Contract address & ABI
│   ├── index.css         # Global styles
│   └── main.jsx          # React entry point
├── public/               # Static assets
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
├── README.md             # This file
└── .gitignore            # Git ignore rules
```

---

## 🚀 Future Enhancements

### Phase 2
- [ ] Add player NFT ownership verification
- [ ] Implement reserve price (minimum acceptable bid)
- [ ] Extend auction duration if bid placed near deadline
- [ ] Auction history & bid analytics dashboard

### Phase 3
- [ ] Multi-chain support (Polygon, Arbitrum)
- [ ] Escrow system for guaranteed funds
- [ ] Player stats & performance ratings
- [ ] Royalties for original owners

### Phase 4
- [ ] Governance token ($AUCTION) for voting
- [ ] DAO-based auction pricing
- [ ] Integration with sports APIs for real player data
- [ ] Mobile app (React Native)

---

## 📄 License

This project is licensed under the **MIT License** - see LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for similar problems
- Provide error logs from browser console (F12 → Console tab)

---

## ⚠️ Important Notes

**Testnet Only:** This is a Sepolia testnet project. Use real ETH/mainnet only after thorough security audits.

**Gas Costs:** Each transaction costs Sepolia ETH for gas fees (~0.001-0.01 ETH per transaction).

**No Financial Advice:** This is for educational purposes only. Not financial or legal advice.

**Smart Contract Risk:** Always have contracts audited by professionals before mainnet deployment.

---

**Happy Auctioning! 🎉**
