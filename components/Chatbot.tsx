import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { createChat } from '../services/geminiService';
import { Chat as GeminiChat } from "@google/genai";
import { UserIcon } from './icons/UserIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Hello! I am MITRA, your AI assistant. How can I help you prepare for a disaster?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<GeminiChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatRef.current = createChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: input });
      
      let botResponse = '';
      setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

      for await (const chunk of stream) {
        botResponse += chunk.text;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = botResponse;
            return newMessages;
        });
      }
    } catch (error) {
      console.error('Gemini chat error:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  return (
    <div className="bg-brand-gray-800 rounded-xl shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-brand-gray-700 flex-shrink-0">
        <h2 className="text-xl font-bold text-brand-gray-100 text-center">Chat with MITRA</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-brand-gray-900">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center flex-shrink-0"><SparklesIcon/></div>}
              <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-brand-blue text-white rounded-br-none' : 'bg-brand-gray-700 text-brand-gray-200 border border-brand-gray-600 rounded-bl-none'}`}>
                {msg.text || <span className="w-2 h-4 bg-brand-gray-500 inline-block animate-pulse"></span>}
              </div>
              {msg.sender === 'user' && <div className="w-8 h-8 bg-brand-gray-600 text-brand-gray-300 rounded-full flex items-center justify-center flex-shrink-0"><UserIcon/></div>}
            </div>
          ))}
          {isLoading && messages[messages.length-1].sender === 'user' && (
             <div className="flex items-start gap-3 justify-start">
               <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center flex-shrink-0"><SparklesIcon/></div>
               <div className="max-w-md p-3 rounded-lg bg-brand-gray-700 text-brand-gray-200 border border-brand-gray-600 rounded-bl-none">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-brand-gray-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></span>
                    <span className="w-2 h-2 bg-brand-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-brand-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                  </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-brand-gray-700 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Ask for help or information..."
            className="flex-1 p-3 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-lg focus:ring-2 focus:ring-brand-blue"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()} className="px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 disabled:bg-brand-gray-600">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;