import React, { useState } from 'react';
import { callSnowflakeLLM } from '../lib/snowflakeApi';

export default function SnowflakeChat({ token, accountId }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await callSnowflakeLLM(newMessages, token, accountId);
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      alert('Failed to get response from Snowflake');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>🤖 Snowflake Chatbot</h3>
      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', margin: '10px 0' }}>
            <span style={{
              display: 'inline-block',
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: msg.role === 'user' ? '#6c63ff' : '#f1f1f1',
              color: msg.role === 'user' ? 'white' : 'black',
              maxWidth: '80%',
            }}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask something..." 
          style={{ flex: 1, padding: '10px' }}
        />
        <button 
          onClick={handleSend} 
          disabled={loading} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c63ff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}