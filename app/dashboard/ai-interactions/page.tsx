'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FiEye, 
  FiUser,
  FiChevronDown,
  FiChevronUp,
  FiCpu,
  FiClock
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import SearchBar from '../../../components/UI/SearchBar';
import FilterDropdown from '../../../components/UI/FilterDropdown';
import Modal from '../../../components/UI/Modal';

// Static dummy data for AI interactions
const dummyInteractions = [
  {
    id: 1,
    userId: 1,
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    sessionId: 'sess_001',
    timestamp: '2024-01-20T10:30:00Z',
    duration: 15,
    messageCount: 8,
    topic: 'Workout Planning',
    sentiment: 'positive',
    satisfaction: 5,
    conversation: [
      {
        role: 'user',
        message: 'I want to start a new workout routine. I have 30 minutes in the morning.',
        timestamp: '2024-01-20T10:30:00Z'
      },
      {
        role: 'assistant',
        message: 'Great! I can help you create an effective 30-minute morning workout routine. What are your main fitness goals?',
        timestamp: '2024-01-20T10:30:15Z'
      },
      {
        role: 'user',
        message: 'I want to lose weight and build some muscle. I have access to basic equipment.',
        timestamp: '2024-01-20T10:30:45Z'
      },
      {
        role: 'assistant',
        message: 'Perfect! For weight loss and muscle building in 30 minutes, I recommend a circuit training approach. Here\'s a sample routine: 5-min warm-up, 20-min circuit (push-ups, squats, lunges, planks), 5-min cool-down. Would you like me to customize this further?',
        timestamp: '2024-01-20T10:31:20Z'
      },
      {
        role: 'user',
        message: 'That sounds good! Can you add some cardio elements?',
        timestamp: '2024-01-20T10:31:50Z'
      },
      {
        role: 'assistant',
        message: 'Absolutely! I\'ll add jumping jacks, mountain climbers, and burpees to increase your heart rate. Here\'s your updated routine: 5-min warm-up, 20-min circuit (push-ups, squats, lunges, planks, jumping jacks, mountain climbers, burpees), 5-min cool-down. Start with 30 seconds each exercise, 10 seconds rest between.',
        timestamp: '2024-01-20T10:32:30Z'
      },
      {
        role: 'user',
        message: 'Perfect! How often should I do this?',
        timestamp: '2024-01-20T10:33:00Z'
      },
      {
        role: 'assistant',
        message: 'For optimal results, aim for 4-5 times per week. You can alternate between this routine and lighter activities like walking or yoga on rest days. Remember to listen to your body and adjust intensity as needed!',
        timestamp: '2024-01-20T10:33:25Z'
      }
    ],
    summary: 'User requested help creating a 30-minute morning workout routine for weight loss and muscle building. Provided a circuit training approach with cardio elements.',
    keywords: ['workout', 'routine', 'weight loss', 'muscle building', 'cardio', 'morning'],
    outcome: 'successful',
    followUpRequired: false
  },
  {
    id: 2,
    userId: 2,
    userName: 'Jane Smith',
    userEmail: 'jane.smith@example.com',
    sessionId: 'sess_002',
    timestamp: '2024-01-20T14:15:00Z',
    duration: 8,
    messageCount: 4,
    topic: 'Nutrition Advice',
    sentiment: 'neutral',
    satisfaction: 4,
    conversation: [
      {
        role: 'user',
        message: 'What should I eat before a workout?',
        timestamp: '2024-01-20T14:15:00Z'
      },
      {
        role: 'assistant',
        message: 'For pre-workout nutrition, focus on easily digestible carbs and a small amount of protein. Good options include: banana with almond butter, Greek yogurt with berries, or a small oatmeal with honey. Eat 30-60 minutes before your workout.',
        timestamp: '2024-01-20T14:15:20Z'
      },
      {
        role: 'user',
        message: 'What about hydration?',
        timestamp: '2024-01-20T14:15:45Z'
      },
      {
        role: 'assistant',
        message: 'Stay hydrated throughout the day, not just before your workout. Drink 16-20 oz of water 2-3 hours before exercise, and 8-10 oz 15-30 minutes before. During exercise, drink 7-10 oz every 10-20 minutes.',
        timestamp: '2024-01-20T14:16:10Z'
      }
    ],
    summary: 'User asked about pre-workout nutrition and hydration. Provided specific recommendations for timing and food choices.',
    keywords: ['nutrition', 'pre-workout', 'hydration', 'carbs', 'protein'],
    outcome: 'successful',
    followUpRequired: false
  },
  {
    id: 3,
    userId: 3,
    userName: 'Mike Johnson',
    userEmail: 'mike.johnson@example.com',
    sessionId: 'sess_003',
    timestamp: '2024-01-20T18:45:00Z',
    duration: 25,
    messageCount: 12,
    topic: 'Injury Recovery',
    sentiment: 'concerned',
    satisfaction: 3,
    conversation: [
      {
        role: 'user',
        message: 'I hurt my knee during squats yesterday. It\'s still sore today. Should I continue working out?',
        timestamp: '2024-01-20T18:45:00Z'
      },
      {
        role: 'assistant',
        message: 'I\'m sorry to hear about your knee injury. It\'s important to prioritize recovery. Can you describe the pain level and any swelling?',
        timestamp: '2024-01-20T18:45:20Z'
      },
      {
        role: 'user',
        message: 'It\'s a 6/10 pain, some swelling, and it\'s stiff when I bend it.',
        timestamp: '2024-01-20T18:45:45Z'
      },
      {
        role: 'assistant',
        message: 'Given the pain level and swelling, I recommend resting and applying ice for 15-20 minutes every few hours. Avoid any exercises that cause pain. Consider consulting a healthcare professional if symptoms persist or worsen.',
        timestamp: '2024-01-20T18:46:15Z'
      },
      {
        role: 'user',
        message: 'How long should I rest?',
        timestamp: '2024-01-20T18:46:40Z'
      },
      {
        role: 'assistant',
        message: 'Start with 2-3 days of complete rest. If pain decreases, you can try gentle range-of-motion exercises. Gradually return to activity only when you can move without pain. If pain persists beyond a week, definitely see a doctor.',
        timestamp: '2024-01-20T18:47:05Z'
      }
    ],
    summary: 'User reported knee injury from squats. Provided injury assessment and recovery recommendations, advised medical consultation if needed.',
    keywords: ['injury', 'knee', 'recovery', 'pain', 'swelling', 'rest'],
    outcome: 'needs_followup',
    followUpRequired: true
  }
];

const AIInteractions: React.FC = () => {
  const [activeNav, setActiveNav] = useState('ai-interactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInteraction, setSelectedInteraction] = useState<typeof dummyInteractions[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterTopic, setFilterTopic] = useState('all');
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Filter options
  const topicOptions = [
    { value: 'all', label: 'All Topics', type: 'topic' as const },
    { value: 'Workout Planning', label: 'Workout Planning', type: 'topic' as const },
    { value: 'Nutrition Advice', label: 'Nutrition Advice', type: 'topic' as const },
    { value: 'Injury Recovery', label: 'Injury Recovery', type: 'topic' as const },
    { value: 'Motivation', label: 'Motivation', type: 'topic' as const },
    { value: 'Goal Setting', label: 'Goal Setting', type: 'topic' as const }
  ];

  const sentimentOptions = [
    { value: 'all', label: 'All Sentiments', type: 'sentiment' as const },
    { value: 'positive', label: 'Positive', type: 'sentiment' as const },
    { value: 'neutral', label: 'Neutral', type: 'sentiment' as const },
    { value: 'negative', label: 'Negative', type: 'sentiment' as const },
    { value: 'concerned', label: 'Concerned', type: 'sentiment' as const }
  ];

  // Filter interactions
  const filteredInteractions = useMemo(() => {
    return dummyInteractions.filter(interaction => {
      const matchesSearch = interaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           interaction.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           interaction.summary.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTopic = filterTopic === 'all' || interaction.topic === filterTopic;
      const matchesSentiment = filterSentiment === 'all' || interaction.sentiment === filterSentiment;
      
      return matchesSearch && matchesTopic && matchesSentiment;
    });
  }, [searchTerm, filterTopic, filterSentiment]);

  const handleViewInteraction = (interaction: typeof dummyInteractions[0]) => {
    setSelectedInteraction(interaction);
    setIsModalOpen(true);
  };

  const toggleRowExpansion = (interactionId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(interactionId)) {
      newExpanded.delete(interactionId);
    } else {
      newExpanded.add(interactionId);
    }
    setExpandedRows(newExpanded);
  };

  const getSentimentBadge = (sentiment: string) => {
    const sentimentConfig = {
      positive: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Positive' },
      neutral: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Neutral' },
      negative: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Negative' },
      concerned: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Concerned' }
    };
    
    const config = sentimentConfig[sentiment as keyof typeof sentimentConfig] || sentimentConfig.neutral;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getSatisfactionStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const handleNavChange = (navId: string) => {
    setActiveNav(navId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <Header title="AI Interactions" />

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Filters */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search interactions..."
                  className="w-full sm:w-64"
                />
                <FilterDropdown
                  options={topicOptions}
                  value={filterTopic}
                  onChange={setFilterTopic}
                  placeholder="All Topics"
                  className="w-full sm:w-56"
                />
                <FilterDropdown
                  options={sentimentOptions}
                  value={filterSentiment}
                  onChange={setFilterSentiment}
                  placeholder="All Sentiments"
                  className="w-full sm:w-56"
                />
              </div>
              <div className="text-sm text-gray-500">
                {filteredInteractions.length} interactions found
              </div>
            </motion.div>

            {/* Interactions Table */}
            <motion.div variants={itemVariants} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        User & Session
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Topic & Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Sentiment & Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Outcome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {filteredInteractions.map((interaction) => (
                      <React.Fragment key={interaction.id}>
                        <tr className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                  <FiUser className="h-5 w-5 text-blue-400" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{interaction.userName}</div>
                                <div className="text-sm text-gray-400">{interaction.userEmail}</div>
                                <div className="text-xs text-gray-500">Session: {interaction.sessionId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{interaction.topic}</div>
                            <div className="text-sm text-gray-400">
                              <FiClock className="inline w-4 h-4 mr-1" />
                              {interaction.duration} min
                            </div>
                            <div className="text-xs text-gray-500">
                              {interaction.messageCount} messages
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="mb-1">{getSentimentBadge(interaction.sentiment)}</div>
                            <div className="flex items-center">
                              {getSatisfactionStars(interaction.satisfaction)}
                              <span className="ml-1 text-xs text-gray-400">({interaction.satisfaction}/5)</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white capitalize">{interaction.outcome}</div>
                            {interaction.followUpRequired && (
                              <div className="text-xs text-orange-400 font-medium">Follow-up needed</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewInteraction(interaction)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleRowExpansion(interaction.id)}
                              className="text-gray-400 hover:text-gray-300"
                            >
                              {expandedRows.has(interaction.id) ? (
                                <FiChevronUp className="w-4 h-4" />
                              ) : (
                                <FiChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                        {expandedRows.has(interaction.id) && (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 bg-gray-700">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium text-white mb-2">Conversation Summary</h4>
                                  <p className="text-sm text-gray-300">{interaction.summary}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-white mb-2">Keywords</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {interaction.keywords.map((keyword, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full"
                                      >
                                        {keyword}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <h4 className="font-medium text-white mb-2">Session Details</h4>
                                    <div className="space-y-1 text-sm text-gray-300">
                                      <div>Duration: {interaction.duration} minutes</div>
                                      <div>Messages: {interaction.messageCount}</div>
                                      <div>Timestamp: {new Date(interaction.timestamp).toLocaleString()}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-white mb-2">User Feedback</h4>
                                    <div className="space-y-1 text-sm text-gray-300">
                                      <div>Sentiment: {interaction.sentiment}</div>
                                      <div>Satisfaction: {interaction.satisfaction}/5</div>
                                      <div>Follow-up: {interaction.followUpRequired ? 'Yes' : 'No'}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-white mb-2">Outcome</h4>
                                    <div className="space-y-1 text-sm text-gray-300">
                                      <div>Result: {interaction.outcome}</div>
                                      <div>Topic: {interaction.topic}</div>
                                      <div>Session ID: {interaction.sessionId}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Interaction Details Modal */}
      {isModalOpen && selectedInteraction && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`AI Interaction - ${selectedInteraction.userName}`}
        >
          <div className="space-y-6">
            {/* Interaction Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FiCpu className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{selectedInteraction.userName}</h3>
                  <p className="text-gray-400">{selectedInteraction.topic}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedInteraction.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  {getSatisfactionStars(selectedInteraction.satisfaction)}
                  <span className="text-sm text-gray-400">({selectedInteraction.satisfaction}/5)</span>
                </div>
                {getSentimentBadge(selectedInteraction.sentiment)}
              </div>
            </div>

            {/* Conversation */}
            <div>
              <h4 className="font-medium text-white mb-3">Full Conversation</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedInteraction.conversation.map((message, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500/10 ml-8'
                        : 'bg-gray-700 mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-300 capitalize">
                        {message.role === 'user' ? 'User' : 'AI Assistant'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{message.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary and Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-2">Summary</h4>
                <p className="text-sm text-gray-300">{selectedInteraction.summary}</p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInteraction.keywords.map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
              <div>
                <h4 className="font-medium text-white mb-2">Session Info</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <div>Duration: {selectedInteraction.duration} minutes</div>
                  <div>Messages: {selectedInteraction.messageCount}</div>
                  <div>Session ID: {selectedInteraction.sessionId}</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Feedback</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <div>Sentiment: {selectedInteraction.sentiment}</div>
                  <div>Satisfaction: {selectedInteraction.satisfaction}/5</div>
                  <div>Follow-up: {selectedInteraction.followUpRequired ? 'Required' : 'Not needed'}</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Outcome</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <div>Result: {selectedInteraction.outcome}</div>
                  <div>Topic: {selectedInteraction.topic}</div>
                  <div>User: {selectedInteraction.userEmail}</div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AIInteractions;
