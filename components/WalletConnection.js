'use client'
import { ethers } from 'ethers';

export default function WalletConnection({ isConnected, address, setIsConnected, setAddress }) {
    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                alert('Please install MetaMask');
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);

            if (accounts.length > 0) {
                setIsConnected(true);
                setAddress(accounts[0]);
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    };

    return (
        <div className="flex justify-center mb-8">
            {isConnected ? (
                <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-green-800">
                        Connected: {address.slice(0, 6)}...{address.slice(-4)}
                    </p>
                </div>
            ) : (
                <button
                    onClick={connectWallet}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Connect Wallet
                </button>
            )}
        </div>
    );
}