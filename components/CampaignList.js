'use client'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract } from '@/lib/contract';

export default function CampaignList() {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = await getContract(provider);

            // Get campaign count
            const campaignCount = await contract.campaignCount();
            const loadedCampaigns = [];

            // Load each campaign
            for (let i = 0; i < campaignCount; i++) {
                const campaign = await contract.getCampaignDetails(i);
                loadedCampaigns.push({
                    id: i,
                    creator: campaign.creator,
                    goal: ethers.utils.formatEther(campaign.goal),
                    deadline: new Date(campaign.deadline * 1000),
                    currentAmount: ethers.utils.formatEther(campaign.currentAmount),
                    description: campaign.description,
                    claimed: campaign.claimed
                });
            }

            setCampaigns(loadedCampaigns);
        } catch (error) {
            console.error('Error loading campaigns:', error);
            setError('Failed to load campaigns');
        } finally {
            setIsLoading(false);
        }
    };

    const handleContribute = async (campaignId) => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = await getContract(signer);

            // For this example, we'll contribute 0.01 ETH
            const contributionAmount = ethers.utils.parseEther('0.01');

            const tx = await contract.contribute(campaignId, {
                value: contributionAmount
            });

            await tx.wait();
            alert('Contribution successful!');
            loadCampaigns(); // Reload campaigns to update the UI
        } catch (error) {
            console.error('Error contributing:', error);
            alert(error.message || 'Error making contribution');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto mt-10 text-center">
                <p className="text-gray-600">Loading campaigns...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-10 text-center">
                <p className="text-red-600">{error}</p>
                <button
                    onClick={loadCampaigns}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Active Campaigns</h2>
                <button
                    onClick={loadCampaigns}
                    className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                >
                    Refresh
                </button>
            </div>

            {campaigns.length === 0 ? (
                <p className="text-center text-gray-600">No campaigns found</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {campaigns.map((campaign) => (
                        <div key={campaign.id} className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-semibold mb-2">{campaign.description}</h3>

                            <div className="space-y-2 mb-4">
                                <p className="text-gray-600">
                                    Goal: <span className="text-black">{campaign.goal} ETH</span>
                                </p>
                                <p className="text-gray-600">
                                    Raised: <span className="text-black">{campaign.currentAmount} ETH</span>
                                </p>
                                <p className="text-gray-600">
                                    Deadline: <span className="text-black">
                                        {campaign.deadline.toLocaleDateString()}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-500">
                                    Created by: {campaign.creator.slice(0, 6)}...{campaign.creator.slice(-4)}
                                </p>
                            </div>

                            <div className="mt-4">
                                <button
                                    onClick={() => handleContribute(campaign.id)}
                                    className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                    disabled={campaign.claimed}
                                >
                                    {campaign.claimed ? 'Campaign Ended' : 'Contribute 0.01 ETH'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}