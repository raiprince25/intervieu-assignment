import React, { useState, useEffect, useRef } from 'react';

const ChatWindow = ({ toggleChat, participants: initialParticipants, questionId }) => {
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
  const [kickedParticipants, setKickedParticipants] = useState([]);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/results');
        const data = await response.json();
        
        if (data.participants) {
          // Filter out kicked participants
          const activeParticipants = data.participants.filter(
            name => !kickedParticipants.includes(name)
          );
          setParticipants(activeParticipants);
        }
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
    const interval = setInterval(fetchParticipants, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [kickedParticipants]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setChatMessages(prev => [
        ...prev,
        { sender: 'You', message: newMessage.trim() }
      ]);
      setNewMessage('');
    }
  };

  const handleKickParticipant = async (participantName) => {
    try {
      // Optimistic UI update
      setParticipants(prev => prev.filter(name => name !== participantName));
      setKickedParticipants(prev => [...prev, participantName]);

      // API call to persist the kick
      const response = await fetch('http://localhost:5000/api/kickParticipant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          participantName
        }),
      });

      if (!response.ok) {
        // Revert if API fails
        setParticipants(prev => [...prev, participantName]);
        setKickedParticipants(prev => prev.filter(name => name !== participantName));
        throw new Error('Failed to kick participant');
      }
    } catch (error) {
      console.error('Error kicking participant:', error);
    }
  };

  return (
    <div className="fixed right-36 bottom-36 w-[477px] h-[429px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50 font-[Sora]">
      {/* Header */}
      <div className="flex border-b border-gray-200 relative">
        <button
          className={`flex-1 w-[35px] font-[Sora] py-3 font-semibold text-base ${
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

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="flex flex-col h-full">
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          >
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === 'User 2' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] break-words px-3 py-2 rounded-lg text-sm font-[Sora]  ${
                    msg.sender === 'User 2'
                      ? 'bg-blue-600 text-[#FFFFFF]'
                      : 'bg-[#3A3A3B] text-[#FFFFFF]' 
                  }`}
                >
                  <div className="font-semibold text-xs mb-1">{msg.sender}</div>
                  {msg.message.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                    <img
                      src={msg.message}
                      alt="sent media"
                      className="max-w-full h-auto rounded-md"
                    />
                  ) : (
                    msg.message
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="border-t p-3">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-l px-3 py-2 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#6766D5] text-white px-4 py-2 rounded-r text-sm font-medium hover:bg-[#5a59c7]"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Participants Tab */}
      {activeTab === 'participants' && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4 items-center">
            <h4 className="text-sm font-[Sora] text-[#726F6F]">Name</h4>
            <h4 className="text-sm font-[Sora] justify-self-end text-[#726F6F]">Action</h4>
          </div>
          <ul className="space-y-2 mt-2">
            {participants.map((name, index) => (
              <li key={index} className="grid grid-cols-2 gap-4 items-center">
                <span className="text-[14px] font-[Sora] font-semibold text-[#000000]">{name}</span>
                <button
                  onClick={() => handleKickParticipant(name)}
                  className="text-[14px] font-[Sora] font-semibold text-[#1D68BD] underline justify-self-end"
                >
                  Kick out
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;