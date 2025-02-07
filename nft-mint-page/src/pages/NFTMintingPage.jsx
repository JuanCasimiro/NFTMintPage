// filepath: /c:/Users/Usuario/Desktop/WorkingDirectory/NFTMintPage/nft-mint-page/src/pages/NFTMintingPage.jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import MintSection from '../components/MintSection';
import CollectionPreview from '../components/CollectionPreview';
import MintModal from '../components/MintModal';
import { requestAccount, getAccountBalance, mint, withdrawFund } from "../utils/contractServices";

const NFTMintingPage = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [mintQuantity, setMintQuantity] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const nftCollection = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
      name: "Crypto Punk #1",
      rarity: "Legendary"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
      name: "Crypto Punk #2",
      rarity: "Rare"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
      name: "Crypto Punk #3",
      rarity: "Common"
    }
  ];

  const connectWallet = async () => {
    try {
      const account = await requestAccount();
      setAccount(account);

      const balance = await getAccountBalance(account);
      setBalance(balance);

      setConnected(true);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleMint = async () => {
    if (!connected) {
      setError("Please connect your wallet first");
      return;
    }

    setError("");
    setIsMinting(true);
    setShowModal(true);

    try {
      mint(mintQuantity);
      setIsMinting(false);

    } catch (error) {
      console.log(error);
      setError("Error minting NFT");
      setIsMinting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {

    connectWallet();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', connectWallet);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', connectWallet);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header connected={connected} account={account} balance={balance} connectWallet={connectWallet} />
      <HeroSection />
      <MintSection
        mintQuantity={mintQuantity}
        setMintQuantity={setMintQuantity}
        isMinting={isMinting}
        error={error}
        onMint={handleMint}
      />
      <CollectionPreview nftCollection={nftCollection} />
      <MintModal showModal={showModal} isMinting={isMinting} onClose={closeModal} />
    </div>
  );
};

export default NFTMintingPage;