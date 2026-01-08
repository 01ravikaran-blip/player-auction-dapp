import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config.js';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [players, setPlayers] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [playerForm, setPlayerForm] = useState({ name: '', position: '', basePrice: '' });
  const [auctionForm, setAuctionForm] = useState({ playerId: '', duration: '600' });
  const [bidForm, setBidForm] = useState({ auctionId: '', bidAmount: '' });

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setMessage('❌ MetaMask not installed');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setAccount(accounts[0]);
      setSigner(signer);
      setContract(contract);
      setMessage('✅ Wallet connected');

      const adminAddress = await contract.admin();
      setIsAdmin(adminAddress.toLowerCase() === accounts[0].toLowerCase());
    } catch (error) {
      console.error('Wallet connection error:', error);
      setMessage('❌ Failed to connect. Make sure MetaMask is on Sepolia.');
    }
  };

  // Fetch players
  const fetchPlayers = async () => {
    if (!contract) return;
    try {
      const playerList = await contract.getPlayerList(100);
      setPlayers(playerList);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  // Fetch auctions
  const fetchAuctions = async () => {
    if (!contract) return;
    try {
      const auctionCount = await contract.auctionCount();
      const auctionList = [];

      for (let i = 1; i <= auctionCount; i++) {
        const auction = await contract.getAuction(i);
        const player = await contract.getPlayer(auction.playerId);
        auctionList.push({
          id: i,
          ...auction,
          playerName: player.name,
          playerPosition: player.position,
        });
      }

      setAuctions(auctionList);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchPlayers();
      fetchAuctions();
      const interval = setInterval(() => {
        fetchPlayers();
        fetchAuctions();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [contract]);

  // Register player
  const handleRegisterPlayer = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setMessage('❌ Only admin can register players');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.registerPlayer(
        playerForm.name,
        playerForm.position,
        ethers.parseEther(playerForm.basePrice)
      );
      await tx.wait();
      setMessage('✅ Player registered!');
      setPlayerForm({ name: '', position: '', basePrice: '' });
      fetchPlayers();
    } catch (error) {
      setMessage('❌ Registration failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Create auction
  const handleCreateAuction = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setMessage('❌ Only admin can create auctions');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.createAuction(
        parseInt(auctionForm.playerId),
        parseInt(auctionForm.duration)
      );
      await tx.wait();
      setMessage('✅ Auction created!');
      setAuctionForm({ playerId: '', duration: '600' });
      fetchAuctions();
      fetchPlayers();
    } catch (error) {
      setMessage('❌ Auction creation failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Place bid
  const handlePlaceBid = async (auctionId, bidAmount) => {
    if (!bidAmount) {
      setMessage('❌ Enter a bid amount');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.placeBid(parseInt(auctionId), {
        value: ethers.parseEther(bidAmount),
      });
      await tx.wait();
      setMessage('✅ Bid placed!');
      setBidForm({ auctionId: '', bidAmount: '' });
      fetchAuctions();
    } catch (error) {
      setMessage('❌ Bid failed. Make sure bid is higher than current.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // End auction
  const handleEndAuction = async (auctionId) => {
    if (!isAdmin) {
      setMessage('❌ Only admin can end auctions');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.endAuction(auctionId);
      await tx.wait();
      setMessage('✅ Auction ended!');
      fetchAuctions();
      fetchPlayers();
    } catch (error) {
      setMessage('❌ Failed to end auction');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>🏆 Player Auction DApp</h1>
          <p>Transparent blockchain-based player transfers & auctions</p>
        </div>
        {!account ? (
          <button className="btn btn-primary" onClick={connectWallet}>
            🔌 Connect MetaMask
          </button>
        ) : (
          <div className="wallet-info">
            <span className="account-address">{account.slice(0, 6)}...{account.slice(-4)}</span>
            {isAdmin && <span className="admin-badge">👤 Admin</span>}
          </div>
        )}
      </header>

      {/* Message Alert */}
      {message && (
        <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`}>
          {message}
          <button onClick={() => setMessage('')} className="alert-close">×</button>
        </div>
      )}

      {account ? (
        <div className="container">
          {/* Admin Panel */}
          {isAdmin && (
            <section className="admin-section">
              <h2>⚙️ Admin Controls</h2>
              <div className="admin-grid">
                {/* Register Player */}
                <div className="card">
                  <h3>📝 Register Player</h3>
                  <form onSubmit={handleRegisterPlayer}>
                    <input
                      type="text"
                      placeholder="Player name"
                      value={playerForm.name}
                      onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Position (e.g., Forward)"
                      value={playerForm.position}
                      onChange={(e) => setPlayerForm({ ...playerForm, position: e.target.value })}
                      required
                    />
                    <input
                      type="number"
                      step="0.001"
                      placeholder="Base price (ETH)"
                      value={playerForm.basePrice}
                      onChange={(e) => setPlayerForm({ ...playerForm, basePrice: e.target.value })}
                      required
                    />
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                      {loading ? '⏳ Processing...' : '✅ Register'}
                    </button>
                  </form>
                </div>

                {/* Create Auction */}
                <div className="card">
                  <h3>🎯 Create Auction</h3>
                  <form onSubmit={handleCreateAuction}>
                    <input
                      type="number"
                      placeholder="Player ID"
                      value={auctionForm.playerId}
                      onChange={(e) => setAuctionForm({ ...auctionForm, playerId: e.target.value })}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Duration (seconds)"
                      value={auctionForm.duration}
                      onChange={(e) => setAuctionForm({ ...auctionForm, duration: e.target.value })}
                      required
                    />
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                      {loading ? '⏳ Processing...' : '✅ Create'}
                    </button>
                  </form>
                </div>
              </div>
            </section>
          )}

          {/* Players Section */}
          <section className="players-section">
            <h2>📋 Registered Players</h2>
            {players.length > 0 ? (
              <div className="players-grid">
                {players.map((player) => (
                  <div key={player.id} className="player-card">
                    <div className="player-header">
                      <h4>{player.name}</h4>
                      <span className="position-badge">{player.position}</span>
                    </div>
                    <div className="player-details">
                      <p><strong>ID:</strong> {Number(player.id)}</p>
                      <p>
                        <strong>Base Price:</strong>{" "}
                        {player.basePrice ? ethers.formatEther(player.basePrice) + " ETH" : "-"}
                      </p>
                      <p><strong>Status:</strong> {player.auctioned ? <span className="status-auction">🔴 In Auction</span> : <span className="status-available">🟢 Available</span>}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty">No players registered yet.</p>
            )}
          </section>

          {/* Auctions Section */}
          <section className="auctions-section">
            <h2>🏅 Active Auctions</h2>
            {auctions.length > 0 ? (
              <div className="auctions-grid">
                {auctions.map((auction) => (
                  <div key={auction.id} className={`auction-card ${auction.ended ? 'ended' : 'active'}`}>
                    <div className="auction-header">
                      <h4>{auction.playerName}</h4>
                      <span className={`status-badge ${auction.ended ? 'ended' : 'active'}`}>
                        {auction.ended ? '✓ Ended' : '⏱ Active'}
                      </span>
                    </div>

                    <div className="auction-details">
                      <p><strong>Position:</strong> {auction.playerPosition}</p>
                      <p><strong>Auction ID:</strong> {Number(auction.id)}</p>
                      <p>
                        <strong>Highest Bid:</strong>{" "}
                        <span className="bid-amount">
                          {auction.highestBid ? ethers.formatEther(auction.highestBid) + " ETH" : "-"}
                         </span>
                      </p>
                      {auction.ended && auction.winner !== '0x0000000000000000000000000000000000000000' && (
                        <p><strong>Winner:</strong> {auction.winner.slice(0, 6)}...{auction.winner.slice(-4)}</p>
                      )}
                    </div>

                    {!auction.ended ? (
                      <div className="auction-actions">
                        <input
                          type="number"
                          step="0.001"
                          placeholder="Your bid (ETH)"
                          onChange={(e) => setBidForm({ auctionId: String(auction.id), bidAmount: e.target.value })}
                        />
                        <button
                          className="btn btn-secondary"
                          onClick={() => handlePlaceBid(auction.id, bidForm.bidAmount)}
                          disabled={loading}
                        >
                          {loading ? '⏳ Bidding...' : '💰 Place Bid'}
                        </button>
                        {isAdmin && (
                          <button
                            className="btn btn-danger"
                            onClick={() => handleEndAuction(Number(auction.id))}
                            disabled={loading}
                          >
                            {loading ? '⏳ Ending...' : '🔚 End Auction'}
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="auction-ended-note">Auction closed</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty">No auctions available.</p>
            )}
          </section>
        </div>
      ) : (
        <div className="connect-prompt">
          <div className="prompt-card">
            <h2>👋 Welcome</h2>
            <p>Connect your MetaMask wallet to get started</p>
            <button className="btn btn-primary" onClick={connectWallet}>
              🔌 Connect Wallet
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>🔗 Decentralized, Transparent, Immutable</p>
      </footer>
    </div>
  );
}

export default App;
