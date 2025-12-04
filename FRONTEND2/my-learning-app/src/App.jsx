import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  BookOpen, 
  Brain, 
  LayoutDashboard, 
  User, 
  Play, 
  BarChart3, 
  Award, 
  Clock, 
  Volume2, 
  CheckCircle, 
  XCircle, 
  Settings,
  Zap,
  Sparkles,
  Loader2,
  LogOut,
  Lock,
  Unlock,
  Trophy,
  Star,
  ChevronRight,
  ChevronLeft,
  Type,
  Palette,
  Mic,
  Music,
  PenTool,
  Wand2,
  Lightbulb,
  Rocket,
  MessageCircle,
  Flame,
  Calendar,
  ArrowRight,
  GraduationCap,
  Calculator,
  Shapes,
  Puzzle,
  HelpCircle,
  History,
  Image as ImageIcon
} from 'lucide-react';

// --- Gemini API Integration ---

const apiKey = "AIzaSyDYn7f-6kLs0WtlaBcPYz2lRRbap6gwMCY"; // API Key injected by environment

async function callGemini(prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate that right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, our AI buddy is taking a nap. Please try again later.";
  }
}

async function callImagen(prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{ prompt: prompt }],
          parameters: { sampleCount: 1 }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Imagen API failed: ${response.statusText}`);
    }

    const data = await response.json();
    const base64Image = data.predictions?.[0]?.bytesBase64Encoded;
    return base64Image ? `data:image/png;base64,${base64Image}` : null;
  } catch (error) {
    console.error("Imagen API Error:", error);
    return null;
  }
}

// --- Mock Data & Utilities ---

const LESSON_CATEGORIES = [
  // Reading Categories
  { id: 'scifi', type: 'reading', title: 'Space Stories', description: 'Blast off into reading adventures.', icon: '🚀', color: 'indigo', time: '10 min', level: 'Fun' },
  { id: 'animals', type: 'reading', title: 'Animal Tales', description: 'Wild stories about furry friends.', icon: '🦁', color: 'orange', time: '8 min', level: 'Easy' },
  // Math/Dyscalculia Categories
  { id: 'counting', type: 'math', title: 'Counting Fun', description: 'Count objects with emojis.', icon: '🔢', color: 'teal', time: '5 min', level: 'Starter' },
  { id: 'addition', type: 'math', title: 'Visual Math', description: 'Add apples, stars, and more.', icon: '➕', color: 'pink', time: '10 min', level: 'Practice' },
  { id: 'patterns', type: 'math', title: 'Logic Patterns', description: 'What comes next?', icon: '🧩', color: 'cyan', time: '15 min', level: 'Brainy' },
];

const QUIZ_TOPICS = [
  { id: 'phonics', title: 'Phonics', description: 'Master the sounds.', icon: '🔊', color: 'blue' },
  { id: 'spelling', title: 'Spelling', description: 'Bee the best speller.', icon: '🐝', color: 'yellow' },
  { id: 'vocab', title: 'Vocabulary', description: 'Learn new words.', icon: '📚', color: 'purple' },
  { id: 'grammar', title: 'Grammar', description: 'Structure your sentences.', icon: '🧩', color: 'teal' },
  { id: 'math', title: 'Math Logic', description: 'Puzzles and numbers.', icon: '🔢', color: 'pink' }
];

const BASE_QUESTIONS = {
  phonics: [
    { id: 1, question: "Which word sounds like 'Cat'?", options: ["Bat", "Car", "Cut", "Cot"], correct: 0 },
    { id: 2, question: "Choose the word ending in -ing", options: ["Sing", "Song", "Sang", "Sung"], correct: 0 }
  ],
  math: [
    { id: 1, question: "What comes next? 🍎 🍌 🍎 🍌 ...", options: ["🍎", "🍌", "🍇", "🍊"], correct: 0 },
    { id: 2, question: "Count the stars: ⭐ ⭐ ⭐", options: ["2", "3", "4", "5"], correct: 1 }
  ]
};

const LEADERBOARD_DATA = [
  { name: "Emma W.", xp: 5400, rank: 1, avatar: "🦄" },
  { name: "Noah B.", xp: 4850, rank: 2, avatar: "🐲" },
  { name: "Liam K.", xp: 4200, rank: 3, avatar: "🤖" },
];

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-6 py-3 rounded-xl font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 shadow-md hover:shadow-lg";
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500",
    secondary: "bg-white text-slate-700 border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50",
    accent: "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-300 hover:to-orange-400",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100 shadow-none hover:shadow-none",
    white: "bg-white text-indigo-600 hover:bg-indigo-50 border-0 shadow-xl shadow-indigo-900/20",
    glass: "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/30 shadow-inner"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 ${className}`}
  >
    {children}
  </div>
);

const WelcomeView = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onStart({ name: name, level: 0, xp: 0, streak: 1, quizHistory: [] });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-white/50 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-6 rounded-3xl w-24 h-24 mx-auto mb-8 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-bounce">
          <Brain className="text-white w-12 h-12" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">StudyBuddy</h1>
        <p className="text-slate-500 mb-10 text-lg font-medium">Your magical learning companion.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-all font-bold text-center text-xl text-indigo-900 placeholder-slate-300 shadow-inner"
              placeholder="What's your name?"
              autoFocus
            />
          </div>
          <Button onClick={handleSubmit} disabled={!name.trim()} className="w-full text-lg py-4 rounded-2xl">
            Start Adventure <Rocket size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
};

const SettingsView = ({ settings, updateSettings, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative border border-white/50">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
          <XCircle size={24} className="text-slate-400" />
        </button>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-xl"><Settings className="text-slate-600" size={24} /></div>
          Preferences
        </h2>

        <div className="space-y-8">
          {/* Dyslexic Font Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Type size={24} /></div>
              <div>
                <p className="font-bold text-slate-800 text-lg">OpenDyslexic</p>
                <p className="text-sm text-slate-500 font-medium">Specialized font face</p>
              </div>
            </div>
            <button 
              onClick={() => updateSettings({ ...settings, useDyslexicFont: !settings.useDyslexicFont })}
              className={`w-16 h-9 rounded-full transition-all duration-300 relative ${settings.useDyslexicFont ? 'bg-indigo-600 shadow-inner' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300 ${settings.useDyslexicFont ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Color Overlay */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-amber-50 p-3 rounded-2xl text-amber-600"><Palette size={24} /></div>
              <div>
                <p className="font-bold text-slate-800 text-lg">Warm Tint</p>
                <p className="text-sm text-slate-500 font-medium">Reduces eye strain</p>
              </div>
            </div>
            <button 
              onClick={() => updateSettings({ ...settings, useOverlay: !settings.useOverlay })}
              className={`w-16 h-9 rounded-full transition-all duration-300 relative ${settings.useOverlay ? 'bg-indigo-600 shadow-inner' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300 ${settings.useOverlay ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Speech Speed */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded-2xl text-green-600"><Mic size={24} /></div>
              <p className="font-bold text-slate-800 text-lg">Voice Speed</p>
            </div>
            <div className="px-2">
              <input 
                type="range" 
                min="0.5" 
                max="1.5" 
                step="0.1" 
                value={settings.speechRate} 
                onChange={(e) => updateSettings({ ...settings, speechRate: parseFloat(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button onClick={onClose} className="w-full mt-10 rounded-2xl" variant="primary">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

const DashboardView = ({ user }) => {
  const fullLeaderboard = [...LEADERBOARD_DATA, { name: `${user.name} (You)`, xp: user.xp, rank: 4, avatar: user.name[0], isUser: true }].sort((a, b) => b.xp - a.xp);
  const [coachTip, setCoachTip] = useState("Loading your personalized tip...");

  useEffect(() => {
    const fetchCoachTip = async () => {
      const prompt = `Act as a friendly, encouraging coach for a student with learning differences. User stats: Level ${user.level}, Streak ${user.streak} days, XP ${user.xp}. Give a 1-sentence motivational tip personalized to these stats. Use emojis.`;
      const tip = await callGemini(prompt);
      setCoachTip(tip);
    };
    fetchCoachTip();
  }, [user.xp]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Clock size={24} /></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today</span>
          </div>
          <div className="text-4xl font-extrabold text-slate-800 mb-1">12<span className="text-lg text-slate-400 ml-1">min</span></div>
          <p className="text-sm text-slate-500 font-medium">Learning Time</p>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600"><Star size={24} /></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
          </div>
          <div className="text-4xl font-extrabold text-slate-800 mb-1">{user.xp}</div>
          <p className="text-sm text-slate-500 font-medium">Experience Points</p>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 rounded-2xl text-green-600"><Flame size={24} /></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current</span>
          </div>
          <div className="text-4xl font-extrabold text-slate-800 mb-1">{user.streak}</div>
          <p className="text-sm text-slate-500 font-medium">Day Streak</p>
        </Card>
      </div>

      {/* Coach's Corner */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] p-8 shadow-lg text-white relative overflow-hidden">
         <div className="relative z-10 flex items-start gap-4">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
               <Sparkles size={32} className="text-yellow-300" />
            </div>
            <div>
               <h3 className="text-xl font-bold mb-2">Coach's Corner 🦄</h3>
               <p className="text-lg font-medium opacity-95 leading-relaxed">"{coachTip}"</p>
            </div>
         </div>
         <div className="absolute -right-10 -bottom-10 opacity-10">
            <Trophy size={200} />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quiz History Section */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-slate-100">
           <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <History size={24} className="text-white" />
                <h2 className="text-xl font-bold">Quiz History</h2>
              </div>
           </div>
           <div className="p-4 max-h-80 overflow-y-auto">
              {user.quizHistory && user.quizHistory.length > 0 ? (
                user.quizHistory.slice().reverse().map((quiz, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl mb-2 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm ${quiz.score / quiz.total > 0.7 ? 'bg-green-100' : 'bg-orange-100'}`}>
                           {quiz.score / quiz.total > 0.7 ? '🌟' : '📚'}
                        </div>
                        <div>
                           <p className="font-bold text-slate-700">{quiz.topic}</p>
                           <p className="text-xs text-slate-400 font-medium">{quiz.date}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="font-black text-lg text-slate-800">{quiz.score}/{quiz.total}</span>
                        <p className="text-xs text-slate-400 font-bold">Score</p>
                     </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400">
                   <p>No quizzes taken yet.</p>
                   <button className="mt-2 text-purple-600 font-bold text-sm">Start your first quiz!</button>
                </div>
              )}
           </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-slate-100">
           <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <Trophy size={24} className="text-yellow-300" />
                <h2 className="text-xl font-bold">Leaderboard</h2>
              </div>
              <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full">Weekly</span>
           </div>
           <div className="p-4">
              {fullLeaderboard.map((p, idx) => (
                <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl mb-2 transition-colors ${p.isUser ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50'}`}>
                   <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 flex items-center justify-center font-bold rounded-full text-sm ${idx < 3 ? 'bg-yellow-100 text-yellow-700' : 'text-slate-400'}`}>
                        {idx + 1}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-xl shadow-sm">
                         {p.avatar}
                      </div>
                      <span className={`font-bold ${p.isUser ? 'text-indigo-900' : 'text-slate-700'}`}>{p.name}</span>
                   </div>
                   <span className="font-mono font-bold text-slate-400 text-sm">{p.xp.toLocaleString()} XP</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

const LessonsView = ({ user, settings }) => {
  const [mode, setMode] = useState('menu'); 
  const [fontSize, setFontSize] = useState(24);
  const [lessonContent, setLessonContent] = useState("");
  const [lessonImage, setLessonImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [aiQuestion, setAiQuestion] = useState(null);
  const [isQuestioning, setIsQuestioning] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const generateLesson = async (category) => {
    setCurrentTopic(category);
    setMode('active');
    setIsGenerating(true);
    setAiQuestion(null);
    setLessonImage(null);
    setShowAnswer(false);

    let complexity = "very simple";
    let length = "short (50 words)";
    if (user.level > 2) { complexity = "moderate"; length = "medium (80 words)"; }

    let prompt = "";
    
    if (category.type === 'reading') {
        prompt = `Write a ${length} story about "${category.title}" for a Dyslexic reader (Level ${user.level}). 
        Format as clean HTML (no markdown symbols). 
        Use <h3 class="text-xl font-bold text-indigo-700 mb-3 mt-4"> for titles.
        Use <p class="mb-4 leading-relaxed"> for paragraphs.
        Use <strong class="text-indigo-600 font-bold"> to highlight tricky words.
        Do not include \`\`\`html tags.`;
    } else {
        prompt = `Create a visual math lesson about "${category.title}" for a Dyscalculic learner. 
        Format as clean HTML (no markdown symbols).
        Structure:
        1. <h3 class="text-xl font-bold text-purple-700 mb-2 mt-4">CONCEPT: title</h3> followed by <p class="mb-4">simple explanation</p>.
        2. <div class="text-5xl my-8 text-center tracking-widest bg-white/50 p-4 rounded-xl border-2 border-dashed border-purple-200">...emojis here...</div> to show the math visually (e.g. 🍎 + 🍎 = 2).
        3. <h3 class="text-xl font-bold text-purple-700 mb-2 mt-4">PRACTICE</h3> <p>A simple problem.</p>
        Keep it friendly and use minimal text. Do not include \`\`\`html tags.`;
    }

    let text = await callGemini(prompt);
    // Cleanup potential code block wrappers from LLM
    text = text.replace(/```html/g, '').replace(/```/g, '');
    setLessonContent(text);
    setIsGenerating(false);
  };

  const generateQuestion = async () => {
    if (!lessonContent) return;
    setIsQuestioning(true);
    setShowAnswer(false);
    setAiQuestion(null);

    const prompt = `Based on this lesson: "${lessonContent.substring(0, 1000)}", generate 1 simple question and answer JSON: {"question": "...", "answer": "..."}`;
    
    try {
        const response = await callGemini(prompt);
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            setAiQuestion(JSON.parse(jsonMatch[0]));
        } else {
            throw new Error("No JSON found");
        }
    } catch (e) {
        console.error("AI Quiz Error:", e);
        setAiQuestion({ question: "What was the main idea?", answer: "Read the lesson one more time!" });
    }
    setIsQuestioning(false);
  };

  const handleVisualize = async () => {
    if (!lessonContent) return;
    setIsVisualizing(true);
    const prompt = `A colorful, friendly, flat illustration for a children's educational app about: ${currentTopic.title}. Style: 3D cartoon, bright colors, simple composition.`;
    const image = await callImagen(prompt);
    setLessonImage(image);
    setIsVisualizing(false);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lessonContent);
      utterance.rate = settings.speechRate;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (mode === 'menu') {
    return (
      <div className="animate-in fade-in duration-700">
         <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">AI-Powered Lessons</h2>
              <p className="text-indigo-100 text-lg max-w-2xl mb-8 opacity-90">Choose a path: adventures in reading or puzzles in math. Our AI adjusts to your style instantly.</p>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <Sparkles size={16} className="text-yellow-300" /> <span>Personalized</span>
                 </div>
                 <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <Zap size={16} className="text-yellow-300" /> <span>Adaptive</span>
                 </div>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-20 transform translate-y-1/4 translate-x-1/4">
               <Brain size={300} />
            </div>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {LESSON_CATEGORIES.map((cat) => (
            <Card 
              key={cat.id}
              onClick={() => generateLesson(cat)}
              className="group cursor-pointer hover:border-indigo-200 relative overflow-hidden !p-0"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl bg-${cat.color}-50 group-hover:scale-110 transition-transform duration-300`}>
                     {cat.icon}
                   </div>
                   <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${cat.type === 'math' ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-500'}`}>
                      {cat.type === 'math' ? 'Math & Logic' : 'Reading Story'}
                   </span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{cat.title}</h3>
                <p className="text-slate-500 font-medium mb-6 line-clamp-2">{cat.description}</p>

                <div className="flex items-center gap-4 text-sm font-bold text-slate-400 mb-8">
                   <div className="flex items-center gap-1"><Clock size={16}/> {cat.time}</div>
                   <div className="flex items-center gap-1"><BarChart3 size={16}/> {cat.level}</div>
                </div>

                <button className="w-full py-4 rounded-xl bg-slate-50 text-slate-700 font-bold group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                   Start Lesson <ArrowRight size={18} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500">
      <button onClick={() => setMode('menu')} className="mb-6 flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors px-4 py-2 rounded-xl hover:bg-white">
        <ChevronLeft size={20} /> Back to Library
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden relative">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
            <div className="relative mb-8">
               <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
               <div className="bg-indigo-50 p-6 rounded-full relative z-10">
                  <Loader2 className="text-indigo-600 animate-spin" size={48} />
               </div>
            </div>
            <p className="text-indigo-900 font-bold text-2xl mb-2">Creating your lesson...</p>
            <p className="text-slate-400">Tailoring words and numbers just for you.</p>
          </div>
        ) : (
          <div className="p-8 md:p-12">
             <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
               <div className="flex items-center gap-4 bg-indigo-50 px-6 py-3 rounded-2xl">
                  {currentTopic.type === 'math' ? <Calculator className="text-indigo-600" size={24} /> : <BookOpen className="text-indigo-600" size={24} />}
                  <h2 className="text-xl font-bold text-indigo-900">{currentTopic.title}</h2>
               </div>
               
               <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                 <button onClick={() => setFontSize(prev => Math.max(18, prev - 2))} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg font-bold text-slate-500 transition-colors">A-</button>
                 <button onClick={() => setFontSize(prev => Math.min(40, prev + 2))} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg font-bold text-slate-500 transition-colors">A+</button>
               </div>
             </div>

            {lessonImage && (
               <div className="mb-8 rounded-3xl overflow-hidden shadow-md border border-slate-100 animate-in fade-in duration-500">
                  <img src={lessonImage} alt="AI Generated Visualization" className="w-full h-64 object-cover" />
               </div>
            )}

            <div 
              className="text-slate-700 leading-loose font-medium transition-all p-8 md:p-10 bg-[#FFFCF0] rounded-3xl border-2 border-[#F5EFE0] shadow-inner"
              style={{ 
                // Updated font stack: Uses Comic Sans variants as fallback for dyslexic style
                fontFamily: settings.useDyslexicFont ? '"Comic Sans MS", "Chalkboard SE", "Comic Neue", sans-serif' : 'Verdana, Geneva, sans-serif',
                fontSize: `${fontSize}px`, 
                letterSpacing: '0.02em',
                wordSpacing: '0.1em',
                lineHeight: '1.8'
              }}
              // Use dangerouslySetInnerHTML to render the HTML returned by the AI
              dangerouslySetInnerHTML={{ __html: lessonContent }}
            />

            <div className="mt-10 flex flex-wrap gap-4">
              <Button onClick={handleSpeak} variant="primary">
                <Volume2 size={20} /> Read Aloud
              </Button>
              
              <Button onClick={generateQuestion} disabled={isQuestioning} variant="accent">
                 {isQuestioning ? <Loader2 className="animate-spin" size={20}/> : <MessageCircle size={20} />}
                 Check Understanding
              </Button>

              <Button onClick={handleVisualize} disabled={isVisualizing || lessonImage} variant="secondary" className="ml-auto">
                {isVisualizing ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} />} 
                {lessonImage ? 'Visual Ready' : 'Visualize This ✨'}
              </Button>
            </div>

            {aiQuestion && (
                <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-[2rem] border border-amber-100 animate-in slide-in-from-bottom-4 shadow-sm">
                    <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2 text-lg">
                        <Sparkles size={20} className="text-amber-500"/> Quick Challenge:
                    </h4>
                    <p className="text-xl text-slate-800 mb-6 font-medium leading-relaxed">{aiQuestion.question}</p>
                    
                    {!showAnswer ? (
                        <button 
                           onClick={() => setShowAnswer(true)} 
                           className="text-amber-700 font-bold bg-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all border border-amber-100"
                        >
                           Reveal Answer
                        </button>
                    ) : (
                        <div className="bg-white p-6 rounded-2xl border border-green-100 flex items-start gap-4 shadow-sm">
                            <CheckCircle className="text-green-500 shrink-0 mt-1" />
                            <p className="text-slate-700 font-bold text-lg">{aiQuestion.answer}</p>
                        </div>
                    )}
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const QuizView = ({ user, updateUserStats, updateQuizHistory }) => {
  const [step, setStep] = useState('topics'); // topics, quiz, summary
  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const startQuiz = async (selectedTopic) => {
    setTopic(selectedTopic);
    setIsLoading(true);
    setStep('quiz');
    setScore(0);
    setCurrentQIndex(0);

    // Adaptive Learning Logic: Check history for this topic
    const lastTopicScore = user.quizHistory?.filter(q => q.topic === selectedTopic.title).pop();
    let difficultyAdjustment = "standard difficulty";
    
    if (lastTopicScore) {
       const pct = lastTopicScore.score / lastTopicScore.total;
       if (pct > 0.8) difficultyAdjustment = "slightly harder than beginner, include one challenging question";
       else if (pct < 0.5) difficultyAdjustment = "easier, focused on fundamentals";
    }

    const prompt = `
      Generate 3 multiple-choice questions about "${selectedTopic.id}".
      Target User Level: ${user.level}.
      Adjustment: User previously scored ${lastTopicScore ? lastTopicScore.score : 'N/A'}. Make it ${difficultyAdjustment}.
      Format: JSON Array only. [{ "id": 1, "question": "...", "options": ["A", "B", "C", "D"], "correct": 0 }]
    `;

    try {
      const responseText = await callGemini(prompt);
      const jsonStr = responseText.replace(/```json|```/g, '').trim();
      const generatedQuestions = JSON.parse(jsonStr);
      setQuestions(generatedQuestions);
    } catch (e) {
      console.error("Fallback to local questions due to AI error", e);
      const fallbackQs = selectedTopic.id === 'math' ? BASE_QUESTIONS.math : BASE_QUESTIONS.phonics;
      setQuestions(fallbackQs);
    }
    setIsLoading(false);
  };

  const handleAnswer = (idx) => {
    if (idx === questions[currentQIndex].correct) {
      setScore(prev => prev + 1);
    }
    
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setStep('summary');
    const earnedXP = 50 + (score * 10) + (user.level * 5);
    
    // Update Stats & History
    updateUserStats(earnedXP);
    updateQuizHistory({
        topic: topic.title,
        score: score + (questions[currentQIndex].correct === -1 ? 0 : (score < questions.length && score > 0 ? 0 : 0)), // Fix visual score lag if needed, relying on state
        total: questions.length,
        date: new Date().toLocaleDateString()
    });
  };

  if (step === 'topics') {
    return (
      <div className="animate-in fade-in duration-700">
         <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-[2.5rem] p-10 text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Quiz Arena</h2>
              <p className="text-indigo-100 text-lg max-w-2xl mb-8 opacity-90">Test your skills and earn badges! The more you play, the smarter the quizzes get.</p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-20 transform translate-y-1/4 translate-x-1/4">
               <Trophy size={300} />
            </div>
         </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {QUIZ_TOPICS.map((t) => (
            <Card 
              key={t.id}
              onClick={() => startQuiz(t)}
              className={`group cursor-pointer hover:border-${t.color}-200 relative overflow-hidden transition-all !p-0`}
            >
              <div className="p-8 flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl bg-${t.color}-50 group-hover:scale-110 transition-transform`}>
                  {t.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xl group-hover:text-indigo-600 transition-colors">{t.title}</h3>
                  <p className="text-slate-400 text-sm">{t.description}</p>
                </div>
                <ChevronRight className="ml-auto text-slate-300 group-hover:text-indigo-600" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'quiz') {
    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-32 text-center">
           <Loader2 className="text-indigo-600 animate-spin mb-4" size={48} />
           <p className="text-indigo-900 font-bold text-xl">AI is preparing your challenge...</p>
        </div>
    );

    const q = questions[currentQIndex];
    return (
      <div className="max-w-2xl mx-auto animate-in slide-in-from-right duration-500">
        <div className="flex justify-between items-center mb-8">
           <span className="font-bold text-slate-400">Question {currentQIndex + 1}/{questions.length}</span>
           <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{topic.title}</span>
        </div>
        
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 mb-8 min-h-[200px] flex items-center justify-center text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">{q.question}</h2>
        </div>

        <div className="grid gap-4">
          {q.options.map((opt, i) => (
            <button 
              key={i}
              onClick={() => handleAnswer(i)}
              className="bg-white p-6 rounded-2xl border-2 border-slate-100 font-bold text-lg text-slate-600 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left flex items-center gap-4 group shadow-sm hover:shadow-md"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm text-slate-500 font-bold group-hover:bg-indigo-200 group-hover:text-indigo-700">
                 {String.fromCharCode(65 + i)}
              </div>
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'summary') {
    return (
      <div className="text-center py-12 animate-in zoom-in duration-500">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl inline-block border border-slate-100 max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500"></div>
          <div className="mb-8 relative inline-block">
             <div className="absolute inset-0 bg-yellow-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
             <Trophy className="w-24 h-24 text-yellow-400 relative z-10" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Quiz Complete!</h2>
          {/* Note: Score calculation here is for display, actual state update happened in finishQuiz */}
          <p className="text-slate-500 text-lg mb-8">You scored <span className="text-indigo-600 font-bold text-2xl">{score + (questions[currentQIndex].correct === -1 ? 0 : (score < questions.length ? 1 : 0))}/{questions.length}</span></p>
          
          <div className="bg-indigo-50 p-6 rounded-2xl mb-8 border border-indigo-100">
             <p className="text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">Rewards Earned</p>
             <p className="text-3xl font-black text-indigo-600">+{50 + (score * 10) + (user.level * 5)} XP</p>
          </div>

          <Button onClick={() => setStep('topics')} className="w-full" variant="primary">
            Try Another Topic
          </Button>
        </div>
      </div>
    );
  }
};

const WritingView = ({ user }) => {
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isFixing, setIsFixing] = useState(false);
  const [isSparking, setIsSparking] = useState(false);

  const handleMagicFix = async () => {
    if (!text.trim()) return;
    setIsFixing(true);
    
    const prompt = `Correct spelling/grammar for Dyslexic student (Level ${user.level}). Text: "${text}". Return JSON: {"fixedText": "...", "tip": "..."}`;
    try {
      const response = await callGemini(prompt);
      const cleanJson = response.replace(/```json|```/g, '').trim();
      setFeedback(JSON.parse(cleanJson));
    } catch (e) {
      setFeedback({ fixedText: text, tip: "Great effort! Keep writing!" });
    }
    setIsFixing(false);
  };

  const handleSpark = async () => {
    setIsSparking(true);
    const prompt = `Fun writing prompt for Dyslexic student (Level ${user.level}). Max 10 words.`;
    const response = await callGemini(prompt);
    setText(response + " ");
    setFeedback(null);
    setIsSparking(false);
  }

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 text-white flex justify-between items-center">
           <div>
             <h2 className="text-3xl font-bold mb-2">Writing Lab ✍️</h2>
             <p className="opacity-90">Your safe space to create.</p>
           </div>
           <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <PenTool size={32} />
           </div>
        </div>

        <div className="p-8">
          <div className="relative">
             <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Once upon a time..."
                className="w-full h-64 p-8 text-xl bg-slate-50 rounded-[2rem] border-2 border-slate-100 focus:border-pink-400 focus:bg-white focus:outline-none resize-none leading-relaxed placeholder-slate-300 transition-all shadow-inner"
             />
             {text.length === 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300 pointer-events-none flex flex-col items-center gap-2">
                   <PenTool size={40} />
                   <span className="font-bold">Start Typing</span>
                </div>
             )}
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-8 justify-between items-center">
            <Button onClick={handleSpark} disabled={isSparking} variant="secondary">
              {isSparking ? <Loader2 className="animate-spin" /> : <Lightbulb size={20} className="text-amber-400"/>}
              Spark Idea
            </Button>
            
            <Button onClick={handleMagicFix} disabled={isFixing || !text} variant="primary" className="w-full md:w-auto shadow-lg shadow-pink-200">
              {isFixing ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
              Magic Polish
            </Button>
          </div>

          {feedback && (
            <div className="mt-8 bg-green-50 p-8 rounded-[2rem] border border-green-100 animate-in slide-in-from-bottom-4">
              <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2 text-lg">
                <Sparkles size={20} className="text-green-500"/> Polished Version
              </h3>
              <p className="text-xl text-slate-800 mb-6 font-medium bg-white/60 p-6 rounded-2xl border border-green-200/50 leading-relaxed">
                {feedback.fixedText}
              </p>
              <div className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                 <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mt-1"><Lightbulb size={20} /></div>
                 <div>
                   <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Helpful Tip</p>
                   <p className="text-slate-700 font-medium">{feedback.tip}</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState(null); 
  const [view, setView] = useState('home');
  const [settings, setSettings] = useState({ useDyslexicFont: false, useOverlay: false, speechRate: 1.0 });
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [wordOfDay, setWordOfDay] = useState({ word: "Loading...", def: "" });

  const handleUpdateStats = (earnedXP) => {
    setUser(prev => ({ ...prev, xp: prev.xp + earnedXP, level: Math.floor((prev.xp + earnedXP) / 1000) }));
  };

  const handleUpdateQuizHistory = (quizResult) => {
    setUser(prev => ({
        ...prev,
        quizHistory: [...(prev.quizHistory || []), quizResult]
    }));
  };

  useEffect(() => {
    if (user) {
      const fetchWord = async () => {
        const prompt = `Generate a "Word of the Day" for a Dyslexic student at Level ${user.level}. Format: JSON with "word" and "def" (simple definition).`;
        try {
          const response = await callGemini(prompt);
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) setWordOfDay(JSON.parse(jsonMatch[0]));
        } catch (e) {
          setWordOfDay({ word: "Resilient", def: "Bouncing back from challenges." });
        }
      };
      fetchWord();
    }
  }, [user?.level]);

  if (!user) return <WelcomeView onStart={setUser} />;

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans pb-32
      ${settings.useDyslexicFont ? 'font-mono' : ''}
      ${settings.useOverlay ? 'bg-amber-50/50' : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50'}
    `}>
      {settings.useOverlay && <div className="fixed inset-0 bg-amber-100/10 pointer-events-none z-[100] mix-blend-multiply" />}

      {/* Glass Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/20 p-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
          <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:scale-110 transition-transform">
            <Brain size={24} />
          </div>
          <span className="text-xl font-extrabold text-slate-800 tracking-tight hidden sm:block group-hover:text-indigo-600 transition-colors">StudyBuddy</span>
        </div>

        <nav className="hidden md:flex gap-1 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50 backdrop-blur-sm">
          {['home', 'lessons', 'writing', 'quiz', 'dashboard'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-5 py-2 rounded-full font-bold text-sm capitalize transition-all duration-300 ${view === v ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
            >
              {v}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
           <div className="hidden lg:flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 text-orange-600 font-bold text-sm">
              <Flame size={16} /> {user.streak}
           </div>
           <button onClick={() => setShowSettings(true)} className="p-2.5 bg-white hover:bg-slate-50 rounded-xl text-slate-500 border border-slate-100 transition-colors"><Settings size={20} /></button>
           <button onClick={() => setShowProfile(true)} className="h-10 w-10 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full text-white font-bold shadow-lg shadow-indigo-200 hover:scale-105 transition-transform border-2 border-white">
             {user.name[0]}
           </button>
        </div>
      </header>

      {showSettings && <SettingsView settings={settings} updateSettings={setSettings} onClose={() => setShowSettings(false)} />}

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        
        {view === 'home' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="relative z-10 max-w-lg">
                 <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold mb-4 border border-white/10">Level {user.level} Explorer</div>
                 <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Ready for a new adventure, {user.name}?</h1>
                 <p className="text-indigo-100 text-lg mb-8 opacity-90">Your daily reading quest awaits. Let's unlock some magic.</p>
                 <div className="flex gap-4">
                   <Button onClick={() => setView('lessons')} variant="white">
                      Start Learning <Play size={20} fill="currentColor" />
                   </Button>
                   <Button onClick={() => setView('quiz')} variant="glass">
                      Take Quiz
                   </Button>
                 </div>
              </div>
              <div className="relative z-10 hidden md:block">
                 <div className="w-64 h-64 bg-white/10 rounded-full backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl relative">
                    <Rocket size={120} className="text-white drop-shadow-lg" />
                    <Star className="absolute top-10 right-10 text-yellow-300 animate-pulse" size={32} />
                    <Star className="absolute bottom-10 left-10 text-yellow-300 animate-pulse" size={24} style={{ animationDelay: '1s' }} />
                 </div>
              </div>
              {/* Background Decorations */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
            </div>

            {/* Daily Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {/* Word of the Day */}
               <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-amber-500"><Lightbulb size={24} /></div>
                    <span className="text-xs font-bold text-amber-400 bg-white px-2 py-1 rounded-lg">Daily</span>
                  </div>
                  <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Word of the Day</h3>
                  <p className="text-2xl font-extrabold text-slate-800 mb-2">{wordOfDay.word}</p>
                  <p className="text-slate-600 italic">"{wordOfDay.def}"</p>
               </Card>

               {/* Daily Quest */}
               <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-blue-500"><CheckCircle size={24} /></div>
                    <span className="text-xs font-bold text-blue-400 bg-white px-2 py-1 rounded-lg">1/3</span>
                  </div>
                  <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Daily Quest</h3>
                  <div className="space-y-3 mt-3">
                     <div className="flex items-center gap-3 text-slate-700 font-medium">
                        <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center text-white text-xs"><CheckCircle size={12} /></div>
                        <span>Login streak</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-400 font-medium">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>
                        <span>Complete 1 Lesson</span>
                     </div>
                  </div>
               </Card>

               {/* Quick Stats */}
               <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 md:col-span-2 lg:col-span-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-emerald-500"><Trophy size={24} /></div>
                  </div>
                  <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Total XP</h3>
                  <p className="text-4xl font-extrabold text-emerald-900 mb-1">{user.xp}</p>
                  <div className="w-full bg-white h-2 rounded-full mt-2 overflow-hidden">
                     <div className="h-full bg-emerald-400 w-3/4 rounded-full"></div>
                  </div>
                  <p className="text-xs text-emerald-600 font-bold mt-2 text-right">Next Level: 120 XP</p>
               </Card>
            </div>
          </div>
        )}

        {view === 'dashboard' && <DashboardView user={user} />}
        {view === 'lessons' && <LessonsView user={user} settings={settings} />}
        {view === 'writing' && <WritingView user={user} />}
        {view === 'quiz' && <QuizView user={user} updateUserStats={handleUpdateStats} updateQuizHistory={handleUpdateQuizHistory} />}
      </main>

      {/* Mobile Floating Nav */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-2 flex justify-between items-center z-50 border border-white/20 ring-1 ring-black/5">
        {['home', 'lessons', 'writing', 'quiz', 'dashboard'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`p-3 rounded-xl transition-all ${view === v ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'text-slate-400'}`}
            >
              {v === 'home' && <Home size={24} />}
              {v === 'dashboard' && <LayoutDashboard size={24} />}
              {v === 'lessons' && <BookOpen size={24} />}
              {v === 'writing' && <PenTool size={24} />}
              {v === 'quiz' && <Brain size={24} />}
            </button>
        ))}
      </div>
    </div>
  );
}