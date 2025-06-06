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
        const response = await fetch('https://new-backend-1-kyhx.onrender.com/api/results');
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
      const response = await fetch('https://new-backend-1-kyhx.onrender.com/api/kickParticipant', {
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
    <div className="fixed right-16 bottom-46 w-[477px] h-[429px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50 font-[Sora]">
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

      {activeTab === 'chat' && (
        <div className="flex flex-col h-full">
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
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
                    className={`max-w-[75%] break-words px-3 py-2 rounded-lg text-[14px] font-[Sora] font-normaltext-sm 
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
        </div>
      )}

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