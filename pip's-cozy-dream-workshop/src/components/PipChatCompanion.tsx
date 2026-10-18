import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Moon, Volume2 } from 'lucide-react';
import { musicBox } from '../utils/audio';

interface Message {
  id: string;
  sender: 'pip' | 'user';
  text: string;
  action?: 'play_lullaby';
}

const PRESET_QUESTIONS = [
  'Can you sing me a lullaby? 🎵',
  'How do you make dreams? 🌙',
  'What do cloud snacks taste like? 🍯',
  'I can\'t fall asleep tonight... 😴',
  'Why do you wear a nightcap? ⭐',
];

export function PipChatCompanion() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'pip',
      text: '*yawn* Hello, little dreamer! I\'m Pip, Junior Dream Engineer. Are your eyelids feeling heavy yet? Ask me anything about star-spinning or cozy bedtime secrets!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const getPipResponse = (query: string): { text: string; action?: 'play_lullaby' } => {
    const q = query.toLowerCase();

    if (q.includes('lullaby') || q.includes('sing') || q.includes('song') || q.includes('music')) {
      return {
        text: '♪ Twinkle... chime... hush-a-bye ♪ I just opened my music box! Listen closely to the gentle brass bells drifting across the clouds. ✨',
        action: 'play_lullaby',
      };
    }

    if (q.includes('how') && (q.includes('dream') || q.includes('make'))) {
      return {
        text: 'I catch soft evening whispers, mix them with warm lavender moon-dust, spin them in my golden cart, and tuck them under your pillow while you count quiet stars! 🌙',
      };
    }

    if (q.includes('snack') || q.includes('taste') || q.includes('eat') || q.includes('food')) {
      return {
        text: 'Star snacks taste like warm honey and roasted vanilla moon-marshmallows! They crunch like autumn leaves, then melt into sweet sleepy yawns. 🍯⭐',
      };
    }

    if (q.includes('sleep') || q.includes('tired') || q.includes('cant') || q.includes("can't") || q.includes('insomnia') || q.includes('awake')) {
      return {
        text: 'Put your hands over your heart and take three long, slow bunny breaths. Breathe in the cool night breeze... and breathe out all the busy daytime thoughts. Pip is watching over your windowsill. 🐰💤',
      };
    }

    if (q.includes('nightcap') || q.includes('hat') || q.includes('clothes')) {
      return {
        text: 'My pink star nightcap was knit by Grandma Nimbus from twilight fleece! The golden bell at the tip jingles softly whenever a good dream is ready for delivery. 🔔✨',
      };
    }

    if (q.includes('scared') || q.includes('nightmare') || q.includes('dark') || q.includes('monster')) {
      return {
        text: 'Don\'t be afraid, little one. I have my glowing star lantern! Shadows are just sleepy shapes waiting for morning. Here—hold this warm wishing star with me. ⭐💛',
      };
    }

    if (q.includes('who') || q.includes('name') || q.includes('pip')) {
      return {
        text: 'I\'m Pip! A sleepy little skull baby with huge glowing starry eyes. My official title is Junior Dream Engineer at the Midnight Nursery, and I love cozy things best. 💖',
      };
    }

    if (q.includes('bunny') || q.includes('plush') || q.includes('toy')) {
      return {
        text: 'That\'s Barnaby! He\'s my plush sleep assistant. He holds the dream ledger while I climb the roof chimneys to adjust star lights. 🧸',
      };
    }

    // Default whimsical response
    const defaults = [
      '*gently blinks starry eyes* That is such a lovely thought. I will weave a golden constellation into tonight\'s dream blanket just for you! ✨',
      'The nursery bells are chiming midnight rounds. Close your eyes for five soft breaths and see where the cloud cart takes you! ☁️',
      '*sleepy squeak* That reminds me of the time a little comet tickled my nightcap. Never forget: good dreams start small. ⭐',
    ];
    return {
      text: defaults[Math.floor(Math.random() * defaults.length)],
    };
  };

  const handleSend = (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText) return;

    // Play chime on send
    musicBox.playNamedNote('E5', 0.4);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getPipResponse(messageText);
      const pipMsg: Message = {
        id: `pip-${Date.now()}`,
        sender: 'pip',
        text: response.text,
        action: response.action,
      };

      setMessages((prev) => [...prev, pipMsg]);
      setIsTyping(false);

      // Play soft response chime
      musicBox.playNamedNote('G5', 0.4);
      setTimeout(() => musicBox.playNamedNote('C6', 0.5), 100);

      // If action is play_lullaby, start lullaby audio
      if (response.action === 'play_lullaby') {
        musicBox.play();
      }
    }, 700);
  };

  return (
    <>
      {/* Floating Chat Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              musicBox.playNamedNote('C5', 0.5);
            }}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#a34063] text-white font-bold text-sm shadow-xl hover:bg-[#8b3452] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            style={{
              fontFamily: "'Outfit', sans-serif",
              boxShadow: '0 8px 24px rgba(163, 64, 99, 0.35)',
            }}
            aria-label="Chat with Pip"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-white/20 border border-white/40">
              <img src="artwork/pip_card_personality_v2.png" alt="Pip" className="w-full h-full object-cover" />
            </div>
            <span>Chat with Pip</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
          </button>
        )}
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <aside
          role="dialog"
          aria-label="Chat with Pip the Dream Engineer"
          className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 rounded-3xl bg-[#fff8f1] dark:bg-[#231526] border-2 border-[#ecd3c1] dark:border-[#523359] shadow-2xl flex flex-col overflow-hidden animate-scale-up"
          style={{
            height: '520px',
            maxHeight: 'calc(100vh - 5rem)',
            boxShadow: '0 16px 48px rgba(163, 64, 99, 0.28)',
          }}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#a34063] to-[#862a4b] text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-white/20 border-2 border-white/40 shadow-xs">
                <img src="artwork/pip_card_personality_v2.png" alt="Pip" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "'Fraunces', serif" }}>
                  Pip · Bedtime Companion
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  <span>Spinning dreams at Midnight Nursery</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fff8f1] dark:bg-[#1a0f1d]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold leading-relaxed shadow-2xs ${
                    m.sender === 'user'
                      ? 'bg-[#a34063] text-white rounded-tr-xs'
                      : 'bg-white dark:bg-[#2e1c33] text-[#38201a] dark:text-[#f8eef2] border border-[#ecd3c1] dark:border-[#523359] rounded-tl-xs'
                  }`}
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  <p>{m.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-3 py-2 bg-white dark:bg-[#2e1c33] border border-[#ecd3c1] dark:border-[#523359] text-xs text-[#8b6154] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a34063] animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a34063] animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a34063] animate-bounce [animation-delay:0.3s]"></span>
                  <span className="ml-1 text-[11px] font-bold">Pip is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-[#fdf2e9] dark:bg-[#27142b] border-t border-[#ecd3c1] dark:border-[#422247] flex gap-1.5 overflow-x-auto no-scrollbar">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-[#3d1e44] text-[#8b3452] dark:text-[#f49bb8] border border-[#ecd3c1] dark:border-[#63336d] hover:border-[#a34063] hover:scale-102 transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#fff8f1] dark:bg-[#231526] border-t border-[#ecd3c1] dark:border-[#523359] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Pip about bedtime dreams..."
              className="flex-1 text-xs sm:text-sm px-3.5 py-2 rounded-full border border-[#ecd3c1] dark:border-[#523359] bg-white dark:bg-[#1a0f1d] text-[#38201a] dark:text-[#f8eef2] focus:outline-hidden focus:border-[#a34063]"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-9 h-9 rounded-full bg-[#a34063] text-white flex items-center justify-center hover:bg-[#8b3452] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0 shadow-xs"
              aria-label="Send message to Pip"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
