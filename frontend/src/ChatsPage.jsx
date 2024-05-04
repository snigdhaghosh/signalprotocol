import React, { useState, useEffect } from "react";
import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from "react-chat-engine-advanced";
import { DoubleRatchet } from "./doubleRatchet"; 

const ChatsPage = (props) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [doubleRatchet, setDoubleRatchet] = useState(null);

  useEffect(() => {
    if (!doubleRatchet) {
      // Initialize Double Ratchet when the component mounts
      const dr = new DoubleRatchet(props.user.username, props.user.secret);
      setDoubleRatchet(dr);
    }
  }, [doubleRatchet, props.user.username, props.user.secret]);

  // Use useMultiChatLogic hook to handle chat logic
  const chatProps = useMultiChatLogic('7e2cd24a-1ede-48c3-beb9-9ff56f2e5ef6', props.user.username, props.user.secret);

  const sendMessage = () => {
    if (!doubleRatchet) return;

    const encryptedMessage = doubleRatchet.encrypt(inputMessage);
    // Send encryptedMessage to the server
    // For example:
    // axios.post("/send-message", { encryptedMessage });
    setInputMessage("");
  };

  const receiveMessage = (encryptedMessage) => {
    if (!doubleRatchet) return;

    const decryptedMessage = doubleRatchet.decrypt(encryptedMessage);
    setMessages((prevMessages) => [...prevMessages, decryptedMessage]);
  };

  return (
    <div style={{ height: "100vh" }}>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <MultiChatSocket {...chatProps} />
      <MultiChatWindow {...chatProps} style={{ height: "100%" }} />
    </div>
  );
};

export default ChatsPage;
