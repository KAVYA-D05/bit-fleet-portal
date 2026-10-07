import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Clock,
  MapPin,
  Truck,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Minimize2,
  Maximize2
} from 'lucide-react';

export const AIAssistantWidget = ({ onNavigateTab = () => {} }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `👋 Hello **${user?.name || 'Faculty Member'}**! I am your **BIT Fleet AI Assistant**.\n\nI can help you with:\n• ⏱️ **Reaching Time & ETA Calculations** from BIT Sathyamangalam (e.g. *"ETA to Coimbatore"*, *"Distance to Bengaluru"*)\n• 🏛️ **Famous Places & Tourist Attractions Near Destination** (e.g. *"Famous places in Ooty"*, *"Sightseeing in Mysore"*)\n• 🌤️ **Live Weather Conditions & Safety Advisory** (e.g. *"Is the weather good to travel tomorrow?"*)\n• 🚍 **Vehicle Availability & Bookings**\n• 📋 **Student Manifests & Gate Passes**\n\nWhat would you like to explore?`,
      suggestions: [
        'ETA to Coimbatore',
        'Famous places in Ooty',
        'Sightseeing in Mysore',
        'Weather to Coimbatore',
        'Check my booking status'
      ]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend = null) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await api.askAI(query);
      if (res.success) {
        const aiMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: res.reply,
          suggestions: res.suggestions || [],
          actionLink: res.actionLink
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: '⚠️ Sorry, I encountered an issue reaching the BIT database. Please try again or check back in a moment.',
          suggestions: ['Try again', 'Check available vehicles']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format bold markdown and bullet lines
  const renderFormattedText = (text) => {
    return text.split('\n').map((line, idx) => {
      // Bold formatter
      const parts = line.split(/(\*\*.*?\*\*|\`.*?\`)/g);

      return (
        <p key={idx} className={line.startsWith('•') ? 'ml-2 my-0.5' : 'my-1'}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
              return <code key={pIdx} className="bg-blue-100/80 text-blue-900 font-mono px-1 py-0.5 rounded text-[11px] font-bold">{part.slice(1, -1)}</code>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 group border border-white/30 cursor-pointer"
          aria-label="Open BIT Fleet AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-black tracking-wide block leading-tight flex items-center gap-1">
              BIT FLEET AI <Sparkles className="w-3 h-3 text-amber-300" />
            </span>
            <span className="text-[10px] text-blue-200 block font-medium">
              Ask ETA & App Help
            </span>
          </div>
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col h-[560px] max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-5 duration-200 font-sans">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-bit-navy via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md border border-white/20">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                  BIT Fleet AI Assistant
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <p className="text-[10px] text-blue-200/80 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live GPS ETA & Transport Co-Pilot
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([
                  {
                    id: 1,
                    sender: 'ai',
                    text: `👋 Chat reset! How can I assist you with reaching times, ETAs, or vehicle bookings?`,
                    suggestions: ['ETA to Coimbatore', 'ETA to Bengaluru', 'Check my booking status']
                  }
                ])}
                title="Reset conversation"
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/80 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  {renderFormattedText(msg.text)}

                  {/* Action Link Button */}
                  {msg.actionLink && (
                    <button
                      onClick={() => {
                        onNavigateTab(msg.actionLink.tab);
                        setIsOpen(false);
                      }}
                      className="mt-2.5 w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-xl border border-blue-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                    >
                      <span>{msg.actionLink.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Quick Suggestion Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[92%]">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(sug)}
                        className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-semibold rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer text-left"
                      >
                        ⚡ {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 max-w-[70%] text-slate-500">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-[11px] font-medium">Calculating ETA & consulting database...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ / Prompt Starters */}
          <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto text-[10px] text-slate-500 font-medium">
            <span className="flex-shrink-0 font-bold text-slate-600">Quick:</span>
            <button
              onClick={() => handleSendMessage('What are the famous places to visit in Ooty for students?')}
              className="px-2 py-0.5 bg-white rounded-md border border-slate-200 hover:border-blue-300 flex-shrink-0 cursor-pointer"
            >
              🏔️ Spots in Ooty
            </button>
            <button
              onClick={() => handleSendMessage('Famous sightseeing places in Coimbatore')}
              className="px-2 py-0.5 bg-white rounded-md border border-slate-200 hover:border-blue-300 flex-shrink-0 cursor-pointer"
            >
              🏛️ Spots in Coimbatore
            </button>
            <button
              onClick={() => handleSendMessage('Is weather good to travel to Ooty tomorrow?')}
              className="px-2 py-0.5 bg-white rounded-md border border-slate-200 hover:border-blue-300 flex-shrink-0 cursor-pointer"
            >
              🌤️ Weather Check
            </button>
            <button
              onClick={() => handleSendMessage('What is the ETA to Coimbatore in a college bus?')}
              className="px-2 py-0.5 bg-white rounded-md border border-slate-200 hover:border-blue-300 flex-shrink-0 cursor-pointer"
            >
              ⏱️ ETA Coimbatore
            </button>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 flex-shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask location ETA (e.g. ETA to Salem)..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
