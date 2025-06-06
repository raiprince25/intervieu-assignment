import React, { useState, useEffect, useRef } from 'react';

const ChatWindow = ({ toggleChat, participants: initialParticipants }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [participants, setParticipants] = useState(initialParticipants || []);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'User 1', message: 'Hey There , how can I help?' },
    { sender: 'User 2', message: 'Nothing bro..just chill!!' },
    { sender: 'User 1', message: 'Gotcha! Just hanging out.' },
    { sender: 'User 2', message: 'Yeah, this poll is interesting!' },
    { sender: 'User 1', message: 'Definitely! Waiting for the next question.' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    setParticipants(initialParticipants || []);
  }, [initialParticipants]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'User 2', message: newMessage.trim() },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="fixed right-16 bottom-46 w-[477px] h-[429px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50 font-[Sora]">
      <div className="flex border-b border-gray-200 relative">
        <button
          className={`flex-1 w-[35px] font-[Sora] py-3  font-semibold text-base ${
            activeTab === 'chat'
              ? 'text-[#6766D5] border-b-2 border-[#6766D5]'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button
          className={`flex-1 py-3 font-semibold text-base ${
            activeTab === 'participants'
              ? 'text-[#6766D5] border-b-2 border-[#6766D5]'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('participants')}
        >
          Participants
        </button>
        <button
          onClick={toggleChat}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
      </div>

      {activeTab === 'chat' && (
  <div className="flex flex-col h-full">
    <div
      ref={messagesContainerRef}
      // Added 'hide-scrollbar' class here
      className="flex-1 overflow-y-auto px-4 py-3 space-y-3 hide-scrollbar"
    >
      {chatMessages.length > 0 ? (
        chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.sender === 'User 2' ? 'items-end' : 'items-start'
            }`}
          >
            <div className={`text-[12px] text-[#4F0BD3] font-[Sora] font-semibold mb-1 ${msg.sender === 'User 2' ? 'pr-1' : 'pl-1'} text-[#4F0BD3]`}>
              {msg.sender}
            </div>
            <div
              className={`max-w-[75%] break-words px-3 py-2 rounded-lg text-[14px] font-[Sora] font-normal text-sm
                ${msg.sender === 'User 2'
                  ? 'bg-[#8F64E1] text-white'
                  : 'bg-[#3A3A3B] text-white'
                }`}
            >
              {
                msg.message.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                  <img
                    src={msg.message}
                    alt="sent media"
                    className="max-w-full h-auto rounded-md"
                  />
                ) : (
                  msg.message
                )
              }
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500 text-center">No messages yet</div>
      )}
      <div ref={messagesEndRef} />
    </div>

    <form
      onSubmit={handleSendMessage}
      className="border-t border-gray-200 p-3 bg-white"
    >
      <div className="flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type message or image URL..."
          className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#6766D5]"
        />
        <button
          type="submit"
          className="bg-[#6766D5] text-white px-4 py-2 rounded-r-lg text-sm font-medium hover:bg-[#5a59c7] transition-colors"
        >
          Send
        </button>
      </div>
    </form>
  </div>
)}

      {activeTab === 'participants' && (
        <div className="flex-1 overflow-y-auto p-4">
          <h4 className="text-sm text-[#726F6F] mb-2">Name</h4>
          <ul className="space-y-2">
            {participants.map((name, index) => (
              <li key={index} className="text-sm text-black">
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
