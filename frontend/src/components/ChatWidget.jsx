import React, { useState, useRef } from "react";
import axios from "axios";

export default function ChatWidget(){
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {from:'bot', text:'Hi — I am your Mindful Miles assistant. Ask me about wellness activities, planning tips, or cultural etiquette.'}
  ]);
  const [input, setInput] = useState("");
  const bodyRef = useRef(null);

  async function send(){
    if (!input.trim()) return;
    const userMsg = {from:'user', text: input};
    setMessages(m=>[...m, userMsg]);
    setInput("");
    try {
      const res = await axios.post('http://localhost:5000/api/chat', {message: input});
      const reply = res.data && (res.data.reply || res.data.error || 'Sorry, no reply.');
      setMessages(m=>[...m, {from:'bot', text: reply}]);
      setTimeout(()=>{ if(bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, 80);
    } catch (e){
      setMessages(m=>[...m, {from:'bot', text: 'Sorry — chat service unavailable.'}]);
    }
  }

  return (
    <div className="chat-widget">
      {!open && <div className="chat-button" onClick={()=>setOpen(true)}>💬</div>}
      {open &&
        <div className="chat-window">
          <div className="chat-header">
            Mindful Miles Assistant
            <button style={{float:'right',background:'transparent',border:'none',color:'white',fontSize:16}} onClick={()=>setOpen(false)}>✕</button>
          </div>
          <div className="chat-body" ref={bodyRef}>
            {messages.map((m,i)=>(
              <div key={i} style={{marginBottom:10,display:'flex',flexDirection: m.from==='bot' ? 'row' : 'row-reverse'}}>
                <div style={{maxWidth:240,padding:10,borderRadius:10,background: m.from==='bot' ? '#f1f5f9' : 'linear-gradient(90deg,var(--primary),#16a34a)', color: m.from==='bot' ? '#042a2b' : 'white'}}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input placeholder="Ask about wellness in a city..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') send(); }} />
            <button className="btn-primary" onClick={send}>Send</button>
          </div>
        </div>
      }
    </div>
  );
}