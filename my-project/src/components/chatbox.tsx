// chatbox.tsx
'use client';

import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { Send, User, Bot, AlertTriangle } from 'lucide-react';
import { Transition } from '@headlessui/react'; // <<<< 1. Impor Transition

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'error';
}

export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessageText = inputValue;
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      text: userMessageText,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setTimeout(scrollToBottom, 100);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessageText }),
      });
      const data = await response.json();
      let botResponse: Message;
      if (response.ok && data.answer) {
        botResponse = { id: `${Date.now()}-bot`, text: data.answer, sender: 'bot' };
      } else {
        const errorMessage = data.error || 'Gagal mendapatkan jawaban dari server.';
        botResponse = { id: `${Date.now()}-error`, text: errorMessage, sender: 'error' };
      }
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      const networkError: Message = {
        id: `${Date.now()}-nerror`,
        text: 'Gagal terhubung ke server. Periksa koneksi Anda atau coba lagi nanti.',
        sender: 'error',
      };
      setMessages((prevMessages) => [...prevMessages, networkError]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const getSenderIcon = (sender: Message['sender']) => {
    if (sender === 'user') return <User className="h-5 w-5 text-white" />;
    if (sender === 'bot') return <Bot className="h-5 w-5 text-sky-600" />;
    if (sender === 'error') return <AlertTriangle className="h-5 w-5 text-red-600" />;
    return null;
  };

  const getBubbleStyles = (sender: Message['sender']) => {
    let baseStyles = "px-4 py-3 rounded-2xl max-w-[80%] shadow-md break-words"; // Sedikit shadow lebih jelas
    if (sender === 'user') {
      return `${baseStyles} bg-sky-500 text-white self-end rounded-br-none`;
    } else if (sender === 'bot') {
      return `${baseStyles} bg-slate-200 text-slate-800 self-start rounded-bl-none`;
    } else {
      return `${baseStyles} bg-red-100 text-red-700 self-start rounded-bl-none border border-red-300`;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          // <<<< 2. Bungkus setiap pesan dengan Transition
          <Transition
            key={msg.id}
            show={true}
            appear={true}
            as={React.Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom={msg.sender === 'user' ? "opacity-0 translate-x-10" : "opacity-0 -translate-x-10"}
            enterTo="opacity-100 translate-x-0"
          >
            <div className={`flex items-end space-x-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender !== 'user' && (
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  msg.sender === 'bot' ? 'bg-sky-100' : 'bg-red-100' // Latar ikon bot/error lebih terang
                }`}>
                  {getSenderIcon(msg.sender)}
                </div>
              )}
              <div className={getBubbleStyles(msg.sender)}>
                {msg.text.split('\n').map((line, index, arr) => (
                  <span key={index}>
                    {line}
                    {index < arr.length - 1 && <br />}
                  </span>
                ))}
              </div>
              {msg.sender === 'user' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-500 flex items-center justify-center"> {/* Latar ikon user lebih gelap */}
                  {getSenderIcon(msg.sender)}
                </div>
              )}
            </div>
          </Transition>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center space-x-3"> {/* Sedikit menambah space */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ketik pertanyaan Anda di sini..."
            disabled={isLoading}
            className="flex-grow p-3 border border-slate-300 rounded-xl 
                       focus:ring-2 focus:ring-sky-400 focus:border-transparent 
                       outline-none transition text-slate-800 placeholder-slate-500" // Warna sudah ditambahkan
            onKeyPress={(e) => { if (e.key === 'Enter' && !isLoading && inputValue.trim()) handleSubmit(e as any);}}
          />
          <button 
            type="submit" 
            disabled={isLoading || !inputValue.trim()} 
            className="p-3 bg-sky-500 text-white rounded-xl 
                       hover:bg-sky-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500
                       disabled:bg-slate-400 disabled:cursor-not-allowed 
                       transition-colors duration-150 flex items-center justify-center transform active:scale-95" // Perbaikan styling tombol
            aria-label="Kirim pesan"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}