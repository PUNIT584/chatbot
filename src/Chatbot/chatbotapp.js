// src/Chatbot/Chatbotapp.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ChatGPTComponent = () => {
    const [user, setUser] = useState(null);
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                loadChatHistory(currentUser.uid);
            } else {
                setChatHistory([]); // Clear chat history if not logged in
            }
        });
        return () => unsubscribe();
    }, []);

    // Function to load chat history from Firestore
    const loadChatHistory = async (uid) => {
        try {
            const chatDoc = doc(db, 'chats', uid);
            const chatSnap = await getDoc(chatDoc);
            if (chatSnap.exists()) {
                setChatHistory(chatSnap.data().messages);
            }
        } catch (err) {
            console.error('Error loading chat history:', err);
            setError('Failed to load chat history.');
        }
    };

    // Function to save chat history to Firestore
    const saveChatHistory = async (uid, messages) => {
        try {
            const chatDoc = doc(db, 'chats', uid);
            await setDoc(chatDoc, { messages }, { merge: true });
        } catch (err) {
            console.error('Error saving chat history:', err);
            setError('Failed to save chat history.');
        }
    };

    const handleSendMessage = async () => {
        if (!user) {
            setError('You must be logged in to send messages.');
            return;
        }

        if (userMessage.trim() === '') return;

        const options = {
            method: 'POST',
            url: 'https://chatgpt-42.p.rapidapi.com/chatgpt',
            headers: {
                'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY, // Use environment variable
                'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
                'Content-Type': 'application/json',
            },
            data: {
                messages: [
                    {
                        role: 'user',
                        content: userMessage,
                    },
                ],
                web_access: false,
            },
        };

        try {
            const response = await axios.request(options);
            const botMessage = response.data.result;

            const updatedChatHistory = [
                ...chatHistory,
                { role: 'user', content: userMessage },
                { role: 'assistant', content: botMessage },
            ];

            setChatHistory(updatedChatHistory);
            setUserMessage('');
            saveChatHistory(user.uid, updatedChatHistory);
        } catch (error) {
            setError('Error fetching data');
            console.error(error);
        }
    };

    // Function to clear chat history from Firestore
    const clearChatHistory = async () => {
        if (!user) return;
        try {
            setChatHistory([]);
            const chatDoc = doc(db, 'chats', user.uid);
            await setDoc(chatDoc, { messages: [] }, { merge: true });
        } catch (err) {
            console.error('Error clearing chat history:', err);
            setError('Failed to clear chat history.');
        }
    };

    // Function to handle logout
    const handleLogout = async () => {
        const confirmLogout = window.confirm('Are you sure you want to log out?');
        if (!confirmLogout) return;
    
        setLoading(true);
        try {
            await signOut(auth);
            navigate('/login'); // Redirect to the login page after logout
        } catch (err) {
            console.error('Error signing out: ', err);
            setError('Failed to log out. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Styles
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f5f5f5',
    };

    const headerStyle = {
        padding: '20px',
        backgroundColor: '#007BFF',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '0 0 10px 10px',
    };

    const titleStyle = {
        margin: 0,
        fontSize: '1.5rem',
    };

    const logoutButtonStyle = {
        padding: '8px 12px',
        fontSize: '0.9rem',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    };

    const logoutButtonHover = {
        backgroundColor: '#c82333',
    };

    const chatContainerStyle = {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        margin: '20px',
    };

    const messageStyle = {
        marginBottom: '15px',
        display: 'flex',
        flexDirection: 'column',
    };

    const userMessageStyle = {
        alignSelf: 'flex-end',
        backgroundColor: '#007BFF',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '20px 20px 0 20px',
        maxWidth: '70%',
        wordBreak: 'break-word',
    };

    const botMessageStyle = {
        alignSelf: 'flex-start',
        backgroundColor: '#e9ecef',
        color: '#212529',
        padding: '10px 15px',
        borderRadius: '20px 20px 20px 0',
        maxWidth: '70%',
        wordBreak: 'break-word',
    };

    const inputContainerStyle = {
        display: 'flex',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)',
        margin: '0 20px 20px 20px',
    };

    const inputStyle = {
        flex: 1,
        padding: '10px 15px',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '20px',
        marginRight: '10px',
        outline: 'none',
        transition: 'border-color 0.3s',
    };

    const sendButtonStyle = {
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    };

    const sendButtonHover = {
        backgroundColor: '#218838',
    };

    const clearButtonStyle = {
        padding: '8px 12px',
        fontSize: '0.9rem',
        backgroundColor: '#ffc107',
        color: '#212529',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
        transition: 'background-color 0.3s',
    };

    const clearButtonHover = {
        backgroundColor: '#e0a800',
    };

    const errorStyle = {
        color: '#dc3545',
        textAlign: 'center',
        marginTop: '10px',
    };

    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <h2 style={titleStyle}>ChatBot</h2>
                {user && (
                    <div>
                        <span style={{ marginRight: '15px', fontSize: '0.9rem' }}>Logged in as : {user.email}</span>
                        <button
                            onClick={handleLogout}
                            aria-label="Log Out"
                            style={logoutButtonStyle}
                            onMouseOver={(e) => e.target.style.backgroundColor = logoutButtonHover.backgroundColor}
                            onMouseOut={(e) => e.target.style.backgroundColor = logoutButtonStyle.backgroundColor}
                            disabled={loading}
                        >
                            {loading ? 'Logging Out...' : 'Log Out'}
                        </button>
                    </div>
                )}
            </div>

            {/* Chat History */}
            <div style={chatContainerStyle}>
                {chatHistory.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#6c757d' }}>Start chatting by typing a message below!</p>
                )}
                {chatHistory.map((message, index) => (
                    <div key={index} style={messageStyle}>
                        <div
                            style={message.role === 'user' ? userMessageStyle : botMessageStyle}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input and Buttons */}
            <div style={inputContainerStyle}>
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#80bdff'}
                    onBlur={(e) => e.target.style.borderColor = '#ccc'}
                />
                <button
                    onClick={handleSendMessage}
                    style={sendButtonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = sendButtonHover.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = sendButtonStyle.backgroundColor}
                >
                    Send
                </button>
            </div>

            {/* Clear Chat History Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <button
                    onClick={clearChatHistory}
                    style={clearButtonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = clearButtonHover.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = clearButtonStyle.backgroundColor}
                >
                    Clear Chat History
                </button>
            </div>

            {/* Error Message */}
            {error && <p style={errorStyle}>{error}</p>}
        </div>
    );
};

export default ChatGPTComponent;
