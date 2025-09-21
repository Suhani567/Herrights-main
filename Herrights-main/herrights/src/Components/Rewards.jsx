import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Gift, Trophy, Star, ArrowLeft, Calendar, Award } from "lucide-react";

export default function Rewards() {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/get-rewards/", {
          headers: { "Authorization": "Bearer YOUR_USER_TOKEN" }
        });
        setPoints(res.data.points || 0);
        setRewardHistory(res.data.history || []);
      } catch (err) {
        console.log("Error fetching rewards:", err);
        // Set default values if API fails
        setPoints(150);
        setRewardHistory([
          { id: 1, description: "Story submission bonus", points: 50, date: "2024-01-15" },
          { id: 2, description: "Community participation", points: 30, date: "2024-01-10" },
          { id: 3, description: "First story milestone", points: 70, date: "2024-01-05" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, []);

  const getRewardLevel = (totalPoints) => {
    if (totalPoints >= 500) return { level: "Diamond", color: "text-purple-600", bg: "bg-purple-100" };
    if (totalPoints >= 300) return { level: "Gold", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (totalPoints >= 150) return { level: "Silver", color: "text-gray-600", bg: "bg-gray-100" };
    return { level: "Bronze", color: "text-orange-600", bg: "bg-orange-100" };
  };

  const rewardLevel = getRewardLevel(points);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Rewards</h1>
              <p className="text-gray-600 mt-1">Track your empowerment points and achievements</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-pink-600 hover:text-pink-700 font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Current Points Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{points}</h3>
              <p className="text-gray-600">Total Points</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className={`text-2xl font-bold ${rewardLevel.color}`}>{rewardLevel.level}</h3>
              <p className="text-gray-600">Current Level</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{rewardHistory.length}</h3>
              <p className="text-gray-600">Achievements</p>
            </div>
          </div>

          {/* Reward History */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Reward History</h2>

            {rewardHistory.length === 0 ? (
              <div className="text-center py-8">
                <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No rewards yet. Share your first story to start earning!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rewardHistory.map((reward) => (
                  <div key={reward.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rewardLevel.bg}`}>
                        <Award className={`w-5 h-5 ${rewardLevel.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{reward.description}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(reward.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-pink-600">+{reward.points}</p>
                      <p className="text-sm text-gray-500">points</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Next Level Progress */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress to Next Level</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current: {rewardLevel.level}</span>
                <span className="text-gray-600">
                  {rewardLevel.level === "Diamond" ? "Max Level!" :
                   rewardLevel.level === "Bronze" ? "150 points to Silver" :
                   rewardLevel.level === "Silver" ? "300 points to Gold" :
                   "500 points to Diamond"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: rewardLevel.level === "Diamond" ? "100%" :
                           rewardLevel.level === "Bronze" ? "30%" :
                           rewardLevel.level === "Silver" ? "50%" : "75%"
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Want to earn more rewards?</p>
            <button
              onClick={() => navigate('/share-story')}
              className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition"
            >
              Share Another Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
