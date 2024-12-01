'use client'
import { useState } from 'react';
import { ethers } from 'ethers';
import { getContract } from '@/lib/contract';

export default function CreateCampaign() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        goal: '',
        duration: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = await getContract(signer);

            // Convert goal to Wei
            const goalInWei = ethers.utils.parseEther(formData.goal);

            // Create campaign transaction
            const tx = await contract.createCampaign(
                goalInWei,
                formData.duration,
                formData.description
            );

            // Wait for transaction to be mined
            await tx.wait();

            // Reset form
            setFormData({
                goal: '',
                duration: '',
                description: ''
            });

            alert('Campaign created successfully!');
        } catch (error) {
            console.error('Error creating campaign:', error);
            alert(error.message || 'Error creating campaign');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Create New Campaign</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="goal" className="block text-gray-700 mb-2">
                        Goal (ETH)
                    </label>
                    <input
                        id="goal"
                        name="goal"
                        type="number"
                        step="0.01"
                        value={formData.goal}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="duration" className="block text-gray-700 mb-2">
                        Duration (days)
                    </label>
                    <input
                        id="duration"
                        name="duration"
                        type="number"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="description" className="block text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        required
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full p-3 text-white rounded transition-colors ${isLoading
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating Campaign...' : 'Create Campaign'}
                </button>
            </form>
        </div>
    );
}
