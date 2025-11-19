import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  ArrowUp, 
  FileText, 
  Image as ImageIcon, 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  X
} from 'lucide-react';

// --- Types & Interfaces ---

interface Post {
  id: number;
  title: string;
  image: string;
}

interface ThemeConfig {
  bg: string;
  sidebar: string;
  card: string;
  accent: string;
  accentHover: string;
  textMain: string;
  textSec: string;
  border: string;
  inputBg: string;
}

type TabType = 'preview' | 'analysis';

interface SidebarProps {
  onNewCampaign: () => void;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- Data & Constants ---

const THEME: ThemeConfig = {
  bg: 'bg-[#EBE7DE]', // Main background
  sidebar: 'bg-[#DED9CD]', // Sidebar slightly darker
  card: 'bg-[#F4F1EA]', // Card/Modal background
  accent: 'bg-[#C27A70]', // Reddish/Brown button
  accentHover: 'hover:bg-[#A6655C]',
  textMain: 'text-[#4A4238]',
  textSec: 'text-[#8C857B]',
  border: 'border-[#D1CBC1]',
  inputBg: 'bg-[#FDFCF8]',
};

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    title: 'Post 1',
    image: 'https://images.unsplash.com/photo-1518998053901-530697783966?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Post 2',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Post 3',
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Post 4',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Post 5',
    image: 'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'Post 6',
    image: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=1000&auto=format&fit=crop',
  },
];

// --- Components ---

const Sidebar: React.FC<SidebarProps> = ({ onNewCampaign }) => {
  return (
    <div className={`w-64 h-screen flex-shrink-0 ${THEME.sidebar} flex flex-col p-6 font-sans`}>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full pl-9 pr-4 py-2 rounded-full bg-[#EDEAE3] border border-transparent focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#C27A70] text-sm placeholder-gray-500 transition-all"
        />
      </div>

      {/* New Campaign Button */}
      <button 
        onClick={onNewCampaign}
        className={`${THEME.accent} ${THEME.accentHover} text-white rounded-xl py-3 px-4 flex items-center justify-between shadow-sm mb-8 transition-colors`}
      >
        <span className="font-medium">New Campaign</span>
        <Plus className="w-5 h-5" />
      </button>

      {/* Menu Items */}
      <nav className="space-y-2">
        <div className={`bg-[#F4F1EA] text-[#4A4238] font-medium px-4 py-3 rounded-xl shadow-sm cursor-pointer`}>
          Scenery Campaign
        </div>
        <div className="text-[#6B6359] hover:bg-[#E6E2D8] px-4 py-3 rounded-xl cursor-pointer transition-colors">
          Shoe Campaign
        </div>
        <div className="text-[#6B6359] hover:bg-[#E6E2D8] px-4 py-3 rounded-xl cursor-pointer transition-colors">
          Personal Posts
        </div>
      </nav>
    </div>
  );
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('preview');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className={`${THEME.card} w-full max-w-6xl h-[85vh] rounded-[2rem] shadow-2xl flex overflow-hidden relative animate-in fade-in zoom-in duration-200`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        {/* Left Panel: Editor */}
        <div className="w-1/2 p-10 border-r border-[#E6E1D6] flex flex-col overflow-y-auto">
          <h2 className={`text-3xl font-semibold ${THEME.textMain} mb-8`}>Scenery Campaign</h2>
          
          {/* Title Input */}
          <div className="mb-6">
            <input 
              type="text" 
              placeholder="Title" 
              className={`w-full text-2xl font-medium bg-transparent border-2 ${THEME.border} rounded-xl px-4 py-3 focus:outline-none focus:border-[#C27A70] placeholder-[#A39D93]`}
            />
          </div>

          {/* Text Area */}
          <div className="flex-1 mb-6 min-h-[200px]">
            <div className={`w-full h-full border-2 ${THEME.border} rounded-2xl p-4 bg-white`}>
              <textarea 
                placeholder="Text" 
                className="w-full h-full resize-none focus:outline-none text-lg placeholder-[#A39D93]"
              ></textarea>
            </div>
          </div>

          {/* Media Attachments */}
          <div className="h-48">
             <div className={`w-full h-full border-2 ${THEME.border} rounded-2xl p-4 bg-white flex flex-col`}>
                <span className="text-[#A39D93] mb-2 block">Media attachments</span>
                <div className="flex-1 border-2 border-dashed border-[#E6E1D6] rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                   <div className="text-center">
                      <ImageIcon className="w-8 h-8 text-[#D1CBC1] mx-auto mb-2" />
                      <span className="text-sm text-[#A39D93]">Drop files here</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Panel: Preview / Analysis */}
        <div className={`w-1/2 p-10 ${THEME.sidebar} flex flex-col`}>
          
          {/* Toggle Switch */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#EBE7DE] p-1 rounded-full flex shadow-inner">
              <button 
                onClick={() => setActiveTab('preview')}
                className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'preview' ? 'bg-[#8C857B] text-white shadow-sm' : 'text-[#8C857B] hover:text-[#4A4238]'}`}
              >
                Preview
              </button>
              <button 
                onClick={() => setActiveTab('analysis')}
                className={`px-8 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'analysis' ? 'bg-[#8C857B] text-white shadow-sm' : 'text-[#8C857B] hover:text-[#4A4238]'}`}
              >
                Analysis
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'preview' ? (
              // PREVIEW TAB
              <div className="bg-white rounded-xl shadow-sm max-w-md mx-auto overflow-hidden">
                {/* Post Header */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" alt="User" />
                    </div>
                    <span className="text-sm font-semibold">FriendName</span>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </div>
                
                {/* Post Image */}
                <div className="aspect-square bg-gray-100">
                   <img 
                    src="https://images.unsplash.com/photo-1481026469463-6635dac54357?q=80&w=1000&auto=format&fit=crop" 
                    alt="Post Content" 
                    className="w-full h-full object-cover"
                   />
                </div>

                {/* Actions */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-4">
                      <Heart className="w-6 h-6 text-gray-800 hover:text-red-500 cursor-pointer" />
                      <MessageCircle className="w-6 h-6 text-gray-800" />
                      <Send className="w-6 h-6 text-gray-800" />
                    </div>
                    <Bookmark className="w-6 h-6 text-gray-800" />
                  </div>
                  
                  <div className="text-sm font-semibold mb-1">33 likes</div>
                  <div className="text-sm">
                    <span className="font-semibold mr-2">FriendName</span>
                    La description du post, lorem ipsum dolor sit amet... <span className="text-gray-400">more</span>
                  </div>
                  <div className="text-gray-400 text-xs mt-2 mb-2 cursor-pointer">View all 3 comments</div>
                  
                  <div className="flex items-center justify-between text-xs mt-1">
                     <div className="flex gap-2">
                        <span className="font-semibold">PersonName</span>
                        <span>Un commentaire du post</span>
                     </div>
                     <Heart className="w-3 h-3 text-gray-400" />
                  </div>
                   <div className="flex items-center justify-between text-xs mt-2">
                     <div className="flex gap-2">
                        <div className="w-[1px] h-full bg-gray-300 mx-1"></div>
                        <span className="font-semibold">FriendName</span>
                        <span>La réponse au commentaire</span>
                     </div>
                     <Heart className="w-3 h-3 text-gray-400" />
                  </div>
                  
                  <div className="text-[10px] text-gray-400 uppercase mt-3">2 hours ago</div>
                </div>
              </div>
            ) : (
              // ANALYSIS TAB
              <div className="bg-[#EBE7DE] rounded-2xl p-8 shadow-sm h-full">
                <p className="text-[#4A4238] font-medium text-lg mb-6">
                  Overall Sentiment is good. Could improve in:
                </p>
                
                <ol className="list-decimal list-inside space-y-4 text-[#6B6359]">
                  <li className="pl-2">Engagement rate is lower than average for sunset posts.</li>
                  <li className="pl-2">Color contrast could be higher to stand out in feed.</li>
                  <li className="pl-2">Caption length is optimal, but could use more emotive words.</li>
                </ol>

                <div className="mt-8 pt-8 border-t border-[#D1CBC1]">
                  <p className="text-[#4A4238] mb-2">Images could be clearer</p>
                  <div className="h-2 w-full bg-[#D1CBC1] rounded-full overflow-hidden">
                     <div className="h-full w-[70%] bg-[#C27A70]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className={`flex w-full h-screen ${THEME.bg} font-sans overflow-hidden`}>
      
      <Sidebar onNewCampaign={() => setIsModalOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen relative">
        <div className="flex-1 overflow-y-auto p-8 pb-32">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-6">
            <h1 className={`text-4xl font-bold ${THEME.textMain}`}>Scenery Campaign</h1>
            
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9C2B5] text-[#6B6359] hover:bg-[#E6E2D8] transition-colors text-sm">
              Add References
              <div className="flex -space-x-2 ml-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-[#EBE7DE] flex items-center justify-center text-[10px] text-blue-500">
                  <FileText size={12} />
                </div>
                <div className="w-6 h-6 rounded-full bg-red-100 border-2 border-[#EBE7DE] flex items-center justify-center text-[10px] text-red-500">
                  <ImageIcon size={12} />
                </div>
                 <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-[#EBE7DE] flex items-center justify-center text-[10px] font-medium text-gray-600">
                  +2
                </div>
              </div>
            </button>
          </div>

          {/* Description Box */}
          <div className={`w-full border border-[#5A5248] rounded-3xl p-6 mb-8 ${THEME.card} text-[#4A4238]`}>
            <p className="leading-relaxed">
              This campaign is marketing a series of seaside scenery paintings. Please ensure you highlight the beauty of the paintings and the hand-made quality. Don't mention the price in the posts.
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_POSTS.map((post) => (
              <div 
                key={post.id} 
                className={`${THEME.card} p-3 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => setIsModalOpen(true)}
              >
                <div className="aspect-square rounded-[1.5rem] overflow-hidden mb-4">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className={`text-xl font-semibold ${THEME.textMain} px-2 pb-2`}>
                  {post.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Bottom Input */}
        <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-center pointer-events-none">
          <div className="w-full max-w-2xl pointer-events-auto">
            <div className="relative">
               <input 
                type="text"
                placeholder="Make a new post here"
                className="w-full pl-6 pr-14 py-4 rounded-full bg-white/90 backdrop-blur shadow-lg border border-[#E6E1D6] focus:outline-none focus:ring-2 focus:ring-[#C27A70]/20 placeholder-gray-400"
                onClick={() => setIsModalOpen(true)}
               />
               <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-[#8C857B] text-white flex items-center justify-center hover:bg-[#6B6359] transition-colors"
                onClick={() => setIsModalOpen(true)}
               >
                 <ArrowUp className="w-5 h-5" />
               </button>
            </div>
          </div>
        </div>

      </main>

      {/* Modal Overlay */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default App;