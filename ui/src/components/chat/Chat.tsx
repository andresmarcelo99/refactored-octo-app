import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SystemMessage = {
  id: 1,
  body: "Welcome to the Nest Chat app",
  author: "Bot",
};

const socket = io('http://localhost:4000', { autoConnect: false });

export function Chat({ currentUser, onLogout }: any) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([SystemMessage]);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("chat", (newMessage) => {
      console.log("New message added", newMessage);
      setMessages((previousMessages) => [...previousMessages, newMessage]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chat");
    };
  }, []);

  const handleSendMessage = (e:any) => {
    if (e.key !== "Enter" || inputValue.trim().length === 0) return;

    socket.emit("chat", { author: currentUser, body: inputValue.trim() });
    setInputValue("");
  };

  const handleLogout = () => {
    socket.disconnect();
    onLogout();
  };

  return (
    <div className="container my-auto">
    <div className="row">
      <div className="col-4">
        <div className="list-group vh-100">
          <a href="#" className="list-group-item list-group-item-action active">Chat 1</a>
          <a href="#" className="list-group-item list-group-item-action">Chat 2</a>
          <a href="#" className="list-group-item list-group-item-action">Chat 3</a>
        </div>
      </div>
    <div className="col-8">
          <div className="chat">
            <div className="chat-message-list">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`chat-message ${
                    currentUser === message.author ? "outgoing" : ""
                  }`}
                >
                  <div className="chat-message-wrapper">
                    <span className="chat-message-author">{message.author}</span>
                    <div className="chat-message-bubble">
                      <span className="chat-message-body">{message.body}</span>
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