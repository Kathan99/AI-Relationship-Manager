import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! I am your AI Relationship Manager. Ask me about your portfolio or expenses.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = {
            sender: 'user',
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/chat', {
                message: input
            });

            setMessages(prev => [...prev, {
                sender: 'bot',
                text: response.data.response,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: "Error: Could not connect to the AI server.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }
        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className="chat-container">
            <div className="chat-history">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.sender}`}>
                        <div className="avatar">
                            {msg.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
                        </div>
                        <div className="bubble">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                            <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '5px', textAlign: 'right' }}>
                                {msg.time}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message bot">
                        <div className="avatar"><Bot size={20} /></div>
                        <div className="bubble" style={{ fontStyle: 'italic', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Loader2 size={16} className="spin-icon" /> Analyzing...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your Tata Silver ETF..."
                    disabled={loading}
                />
                <button onClick={sendMessage} disabled={loading || !input.trim()}>
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;