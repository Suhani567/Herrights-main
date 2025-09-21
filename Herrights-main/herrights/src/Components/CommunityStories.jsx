import React from 'react';
import { useNavigate } from 'react-router-dom';
import {PenSquare, Gift} from 'lucide-react';

const CommunityStories = () => {
    const navigate = useNavigate();

    const handleShareStory = () => {
        navigate('/share-story');
    };

    const handleViewRewards = () => {
        navigate('/rewards');
    };

    return (
        <section id="stories" className='py-20 px-6 bg-gradient-to-br from-pink-50 to-purple-100'>
            <div className='max-w-5xl mx-auto text-center'>

                {/* heading */}
                <h2 className='text-3xl font-bold mb-6 text-gray-800'>
                    Share Your Story, <span className='text-pink-600'>Earn Rewards</span>
                </h2>

                <p className='text-gray-600 mb-10 max-w-2xl mx-auto'>
                    Every voice matters. Share your experience and inspire other women.
          For every story you share, you'll earn <span className="font-semibold text-pink-700"> empowerment points </span>
           that unlock rewards and recognition in our community.
                </p>

                {/* Buttons */}

                <div className='flex flex-col sm:flex-row justify-center gap-4'>
                    <button
                        onClick={handleShareStory}
                        className='flex items-center gap-2 px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition'
                    >
                        <PenSquare className = "w-5 h-5" />
                        Share Your Story
                    </button>

                    <button
                        onClick={handleViewRewards}
                        className='flex items-center gap-2 px-6 py-3 border-2 border-pink-600 text-pink-600 font-semibold rounded-xl hover:bg-pink-50 transition'
                    >
                        <Gift className = "w-5 h-5" />
                        View Rewards
                    </button>
                </div>

                {/* Coming soon  */}
                <p className='mt-6 text-lg text-gray-500 italic'>
                    Web3 Rewards feature coming soon – Earn tokens for every contribution!
                </p>
            </div>
        </section>
    )
}
export default CommunityStories;
