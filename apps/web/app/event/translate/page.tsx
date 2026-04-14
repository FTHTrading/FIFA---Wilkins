'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Badge } from '@wilkins/ui';
import { useGuestSession } from '@/components/providers/guest-session-provider';

interface ChatMessage {
  id: string;
  role: 'guest' | 'staff' | 'system';
  text: string;
  translation?: string;
  confidence?: 'high' | 'medium' | 'low';
  timestamp: string;
}

const QUICK_REPLIES = [
  'Where is the nearest restroom?',
  'I need medical assistance.',
  'Where is Gate A?',
  'I lost my item.',
  'I need transportation.',
];

export default function TranslatePage() {
  const { languageCode } = useGuestSession();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'system',
      text: 'Connected to live translation. A staff member will respond shortly.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage(text?: string) {
    const content = text ?? input.trim();
    if (!content) return;

    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'guest',
      text: content,
      confidence: 'high',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setInput('');

    // Simulate staff typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'staff',
          text: 'Thank you for your message. A staff member will assist you shortly.',
          timestamp: new Date().toISOString(),
        },
      ]);
    }, 2000);
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] bg-brand-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border bg-brand-navy">
        <div>
          <h1 className="font-display font-semibold text-white text-sm">Live Translation</h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Language: <span className="text-brand-gold font-medium uppercase">{languageCode}</span>
          </p>
        </div>
        <Badge variant="success" className="text-2xs">
          ● Connected
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          if (msg.role === 'system') {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-xs text-brand-muted bg-brand-surface px-3 py-1 rounded-full">
                  {msg.text}
                </span>
              </div>
            );
          }
          const isGuest = msg.role === 'guest';
          return (
            <div key={msg.id} className={`flex ${isGuest ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 ${
                  isGuest
                    ? 'bg-brand-gold text-brand-black rounded-br-sm'
                    : 'bg-brand-surface text-white rounded-bl-sm border border-brand-border'
                }`}
              >
                {!isGuest && (
                  <p className="text-2xs font-semibold text-brand-electric mb-1 uppercase tracking-wide">
                    Staff
                  </p>
                )}
                <p className="text-sm leading-relaxed">{msg.text}</p>
                {msg.translation && (
                  <p className="text-xs mt-2 opacity-70 border-t border-black/10 pt-2">
                    {msg.translation}
                  </p>
                )}
                {msg.confidence === 'low' && (
                  <p className="text-2xs mt-1 text-brand-warning font-medium">
                    ⚠ Low confidence — verify with staff
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-brand-surface border border-brand-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-muted animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-muted animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-muted animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
        {QUICK_REPLIES.map((qr) => (
          <button
            key={qr}
            onClick={() => sendMessage(qr)}
            className="shrink-0 text-xs bg-brand-surface border border-brand-border text-brand-text rounded-full px-3 py-1.5 hover:border-brand-gold hover:text-brand-gold transition-colors"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="px-4 pb-4 pt-1 border-t border-brand-border bg-brand-navy">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type your message…"
            rows={1}
            className="flex-1 bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-brand-muted resize-none focus:outline-none focus:border-brand-gold transition-colors"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim()}
            className="shrink-0 h-10 w-10 p-0 rounded-xl"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22 11 13 2 9l20-7z" />
            </svg>
          </Button>
        </div>
        <p className="text-2xs text-brand-muted text-center mt-2">
          Messages are translated in real-time · Powered by Wilkins AI
        </p>
      </div>
    </div>
  );
}
