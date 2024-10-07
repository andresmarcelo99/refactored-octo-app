import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
const SystemMessage = {
  id: 999999,
  text: 'Welcome to the Nest Chat app',
  user: {
    id: 99999,
    nickname: 'Bot',
  },
  chat: {
    id: 1,
  },
};
const socket = io('http://localhost:4080', { autoConnect: false });

interface ChatProps {
  currentUser: {
    nickname: string;
    id: number;
  };
}

export function Chat({ currentUser }: ChatProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([SystemMessage]);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('Socket connected');
    });
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.emit('load_chat', { id: 1 });

    socket.on('loaded_messages', (loaded_messages) => {
      console.log('Messages loaded');
      setMessages((previousMessages) => [
        ...previousMessages,
        ...loaded_messages,
      ]);
    });
    socket.on('add_msg', (newMessage) => {
      console.log('New message added', newMessage);
      setMessages((previousMessages) => [...previousMessages, newMessage]);
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chat');
    };
  }, []);

  const handleSendMessage = (e: any) => {
    if (e.key !== 'Enter' || inputValue.trim().length === 0) return;
    const payload = {
      text: inputValue,
      user: { id: currentUser.id },
      chat: { id: 1 },
    };
    socket.emit('new_msg', payload);
    setInputValue('');
  };
  // const handleLogout = () => {
  //   socket.disconnect();
  //   onLogout();
  // };
  return (
    <div className="container my-auto">
      <div className="row">
        <div className="col-8">
          <div className="chat">
            <div className="chat-message-list">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`chat-message ${
                    currentUser.id === message.user.id ? 'outgoing' : ''
                  }`}
                >
                  <div className="chat-message-wrapper">
                    <span className="chat-message-author">
                      {message.user.nickname}
                    </span>
                    <div className="chat-message-bubble">
                      <span className="chat-message-body">{message.text}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-composer">
              <input
                className="chat-composer-input"
                placeholder="Type message here"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleSendMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
