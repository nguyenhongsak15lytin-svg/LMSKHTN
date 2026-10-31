import React, { useState } from 'react';
import { askAIStudyBuddy } from '../../services/geminiService';
import { Sparkles, Loader2, X, Send, Bot, User } from 'lucide-react';

interface AIStudyBuddyModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextLessonTitle?: string;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const AIStudyBuddyModal: React.FC<AIStudyBuddyModalProps> = ({
  isOpen,
  onClose,
  contextLessonTitle
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: contextLessonTitle
        ? `Xin chào! Tôi là Trợ lý AI học tập. Tôi thấy bạn đang học bài "${contextLessonTitle}". Bạn có thắc mắc gì cần tôi giải đáp không?`
        : 'Xin chào! Tôi là Trợ lý AI học tập. Bạn có câu hỏi gì về bài học hay bài tập hôm nay không?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    const aiReply = await askAIStudyBuddy(userMsg, contextLessonTitle);
    setLoading(false);
    setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg h-[600px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Trợ lý AI Học Tập Thông Minh
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {contextLessonTitle ? `Ngữ cảnh: ${contextLessonTitle}` : 'Giải đáp 24/7 mọi thắc mắc học tập'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                AI đang suy nghĩ...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Nhập câu hỏi của bạn cho AI..."
            className="flex-1 px-4 py-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
