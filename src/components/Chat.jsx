import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiReplyAllLine } from "react-icons/ri";
import { TbCopyCheckFilled } from "react-icons/tb";

const Chat = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm here to listen without judgment. How are you feeling today?", reply: "" }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showToast, setShowToast] = useState(false);
    const [replyTo, setReplyTo] = useState(null); // Track message being replied to
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        if (!isOnline) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }

        const userMessage = {
            role: 'user',
            content: inputText,
            reply: replyTo ? replyTo.content : ""
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputText('');
        setReplyTo(null);
        setIsLoading(true);

        try {
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages })
            });

            const text = await response.text();

            if (!response.ok) {
                let errorMessage = "AI unavailable. Please try again later.";
                try {
                    const errorJson = JSON.parse(text);
                    errorMessage = errorJson.error || errorMessage;
                } catch (e) { }
                throw new Error(errorMessage);
            }

            const data = JSON.parse(text);
            const aiReply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";

            setMessages(prev => [...prev, { role: 'assistant', content: aiReply, reply: "" }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: error.message || "Something went wrong.", reply: "" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-page-container fade-in">
            <div className="chat-header-actions">
                <button className="back-btn-modern" onClick={() => navigate('/')}>
                    <span className="icon">←</span> Back to Safety
                </button>
            </div>

            <div className="chat-glass-card">
                <div className="chat-info-bar">
                    <div className="status-indicator">
                        <div className={`status-dot ${isOnline ? 'online' : 'offline'}`}></div>
                        <span>AI Assistant {isOnline ? '(Online)' : '(Offline)'}</span>
                    </div>
                </div>

                <div className="chat-top-banner">
                    <h1>AI Support Chat</h1>
                    <p className="disclaimer-text">
                        A safe space for early-career support. Note: I am an AI, not a therapist.
                    </p>
                </div>

                <div className="chat-messages-viewport">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-bubble-wrapper ${msg.role === 'user' ? 'user-align' : 'assistant-align'}`}>
                            <div className="message-bubble-container">
                                <div className={`message-bubble ${msg.role}`}>
                                    {msg.reply && <div className="replied-message">{msg.reply}</div>}
                                    {msg.content}
                                </div>
                                <div className="bubble-actions">
                                    <button
                                        className="circle-btn"
                                        onClick={() => navigator.clipboard.writeText(msg.content)}
                                        title="Copy"
                                    >
                                        <TbCopyCheckFilled />
                                    </button>
                                    <button
                                        className="circle-btn"
                                        onClick={() => setReplyTo(msg)}
                                        title="Reply"
                                    >
                                        <RiReplyAllLine />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message-bubble-wrapper assistant-align">
                            <div className="message-bubble assistant typing">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-controls-area">
                    {replyTo && (
                        <div className="reply-preview-bar">
                            <span className="replying-to">Replying to:</span>
                            <div className="reply-text">{replyTo.content}</div>
                            <button className="cancel-reply" onClick={() => setReplyTo(null)}>×</button>
                        </div>
                    )}
                    <div className="input-glass-wrapper">
                        <textarea
                            placeholder="Share what's on your mind..."
                            rows="1"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        ></textarea>
                        <button
                            className={`send-button-fab ${!inputText.trim() || isLoading ? 'disabled' : ''}`}
                            onClick={handleSend}
                            disabled={isLoading || !inputText.trim()}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {showToast && (
                <div className="toast-notification">
                    You need to be online to use this feature
                </div>
            )}

            <style>{`
                /* Container */
                .chat-page-container { max-width: 800px; margin:0 auto; padding:16px; display:flex; flex-direction:column; height:calc(100vh - 120px);}
                .chat-header-actions { margin-bottom:16px; }
                .back-btn-modern { background:#b3f5eda3; border:1px solid rgba(255,255,255,0.1); color:#555; padding:8px 16px; border-radius:8px; cursor:pointer; display:flex; align-items:center; gap:8px; transition:all 0.3s;}
                .back-btn-modern:hover { background:#2bebd4a3; color:#111; transform:translateX(-5px);}

                /* Glass card */
                .chat-glass-card { background: rgba(255,255,255,0.03); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.1); border-radius:24px; display:flex; flex-direction:column; flex:1; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.3);}
                .chat-info-bar { padding:12px 24px; background: rgba(255,255,255,0.02); border-bottom:1px solid rgba(255,255,255,0.05); display:flex; justify-content:space-between; font-size:13px;}
                .status-indicator { display:flex; align-items:center; gap:8px; color:#999;}
                .status-dot { width:8px; height:8px; border-radius:50%;}
                .status-dot.online { background:#10b981; box-shadow:0 0 8px #10b981;}
                .status-dot.offline { background:#ef4444;}

                /* Top Banner */
                .chat-top-banner { padding:24px; text-align:center; background:linear-gradient(to bottom, rgba(99,102,241,0.05), transparent);}
                .chat-top-banner h1 { font-size:24px; margin-bottom:8px; background:linear-gradient(135deg,#bdb2b2 0%,#a5b4fc 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;}
                .disclaimer-text { font-size:13px; color:#777; max-width:80%; margin:0 auto; }

                /* Messages */
                .chat-messages-viewport { flex:1; padding:24px; overflow-y:auto; display:flex; flex-direction:column; gap:16px; scrollbar-width:thin; scrollbar-color: rgba(255,255,255,0.1) transparent;}
                .chat-messages-viewport::-webkit-scrollbar { width:6px;}
                .chat-messages-viewport::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius:10px;}
                .message-bubble-wrapper { display:flex; width:100%; }
                .user-align { justify-content:flex-end; }
                .assistant-align { justify-content:flex-start; }

                /* Bubble + buttons flex */
                .message-bubble-container { display:flex; align-items:center; gap:6px; }
                .bubble-actions { display:flex; gap:6px; opacity:0; transition:opacity 0.2s; }
                .message-bubble-container:hover .bubble-actions { opacity:1; }

                .circle-btn { width:28px; height:28px; border-radius:50%; background: rgba(0,0,0,0.05); display:flex; align-items:center; justify-content:center; cursor:pointer; border:none; color:#333; font-size:16px;}
                .circle-btn:hover { background: rgba(0,0,0,0.1); }

                /* Bubble */
                .message-bubble { max-width:85%; padding:14px 18px; border-radius:18px; font-size:15px; line-height:1.5; position:relative; animation:fadeInUp 0.4s cubic-bezier(0.23,1,0.32,1);}
                .message-bubble.user { background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%); color:white; border-bottom-right-radius:4px; box-shadow:0 4px 15px rgba(99,102,241,0.3);}
                .message-bubble.assistant { background: linear-gradient(135deg, #d9d9dd 0%, #8a8a8a 100%); color:#0f1c61; border-bottom-left-radius:4px; border:1px solid rgba(255,255,255,0.05);}
                .replied-message { font-size:12px; color:#f0f0f0; margin-bottom:4px; border-left:2px solid #ccc; padding:6px; backdrop-filter: hue-rotate(15deg);border-radius: 5px;}

                /* Reply Preview */
                .reply-preview-bar { background: rgba(0,0,0,0.08); padding:6px 12px; border-left:4px solid #6366f1; border-radius:6px; display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;}
                .replying-to { font-size:12px; color:#555; margin-right:8px;}
                .reply-text { flex:1; font-size:14px; color:#111; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
                .cancel-reply { border:none; background:none; cursor:pointer; font-size:18px; color:#555;}

                /* Input */
                .chat-controls-area { padding:24px; background: rgba(255,255,255,0.02); border-top:1px solid rgba(255,255,255,0.05);}
                .input-glass-wrapper { background: rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1); border-radius:30px; padding:8px 12px 8px 24px; display:flex; align-items:center; gap:12px; transition:border-color 0.3s;}
                .input-glass-wrapper:focus-within { border-color: rgba(99,102,241,0.5);}
                .input-glass-wrapper textarea { flex:1; background:transparent; border:none; color:inherit; resize:none; padding:8px 0; font-family:inherit; font-size:15px; max-height:100px; outline:none !important;}

                /* Send button */
                .send-button-fab { width:44px; height:44px; border-radius:50%; background:#6366f1; border:none; color:white; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.3s; flex-shrink:0; transform:rotate(45deg);}
                .send-button-fab:hover { background:#4f46e5; transform:scale(1.05) rotate(0);}
                .send-button-fab.disabled { background: rgba(255,255,255,0.1); color: rgba(136,133,133,0.3); cursor:not-allowed;}
                .send-button-fab svg { width:20px; height:20px; transform:translateX(1px);}

                /* Typing animation */
                .typing .dot { width:6px; height:6px; background:#999; border-radius:50%; display:inline-block; margin:0 2px; animation:bounce 1.4s infinite ease-in-out;}
                .typing .dot:nth-child(2){ animation-delay:0.2s;}
                .typing .dot:nth-child(3){ animation-delay:0.4s;}
                @keyframes bounce { 0%,80%,100% {transform:translateY(0);} 40% {transform:translateY(-6px);}}
                @keyframes fadeInUp { from {opacity:0; transform:translateY(10px);} to {opacity:1; transform:translateY(0);}}

                /* Toast */
                .toast-notification { position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:#ef4444; color:white; padding:12px 24px; border-radius:12px; box-shadow:0 8px 25px rgba(239,68,68,0.3); z-index:2000; font-weight:500; animation: slideUp 0.3s cubic-bezier(0.175,0.885,0.32,1.275);}
                @keyframes slideUp { from {transform:translate(-50%,20px); opacity:0;} to {transform:translate(-50%,0); opacity:1;}}

                @media (max-width:600px) {
                    .chat-page-container { padding:10px; height:calc(100vh - 100px);}
                    .chat-glass-card { border-radius: var(--radius-l);}
                    .message-bubble { max-width:90%; font-size:14px;}
                }
            `}</style>
        </div>
    );
};

export default Chat;