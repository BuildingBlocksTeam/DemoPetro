import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, Send, Bot, User, Minimize2, Maximize2, 
  Lightbulb, TrendingUp, AlertTriangle, DollarSign, Clock,
  X, RotateCcw
} from 'lucide-react';

const AIChat = ({ workflow, isMinimized, onToggleMinimize, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '¡Hola! Soy tu asistente de IA para el Digital Twin. Puedo ayudarte a optimizar procesos, analizar datos y sugerir mejoras.',
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: 2,
      type: 'bot',
      content: 'He detectado algunas oportunidades de mejora en tu workflow actual. ¿Te gustaría que las revise contigo?',
      timestamp: new Date(Date.now() - 30000),
      suggestions: [
        { type: 'optimization', text: 'Revisar eficiencia de procesos', icon: TrendingUp },
        { type: 'cost', text: 'Análisis de reducción de costos', icon: DollarSign },
        { type: 'risk', text: 'Evaluar riesgos del proyecto', icon: AlertTriangle }
      ]
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    'optimización': 'Basándome en tu workflow actual, he identificado 3 áreas clave de optimización: 1) Paralelización de tareas independientes (ahorro de 15% en tiempo), 2) Automatización de procesos manuales (reducción de 23% en errores), 3) Optimización de recursos (mejora de 18% en eficiencia).',
    'costos': 'El análisis de costos muestra oportunidades de ahorro de hasta $450K anuales mediante: consolidación de proveedores (12% ahorro), optimización energética (8% reducción), y mejora en planificación de recursos (15% eficiencia).',
    'riesgos': 'He detectado 5 riesgos potenciales en tu proyecto: 2 de alta prioridad (dependencias críticas), 2 de media prioridad (recursos compartidos), y 1 de baja prioridad (factores externos). ¿Quieres que profundice en alguno específico?',
    'eficiencia': 'La eficiencia actual del sistema es del 87.3%. Para alcanzar el 95% objetivo, recomiendo: optimizar el cuello de botella en el proceso de validación, implementar cache inteligente, y balancear mejor la carga de trabajo.',
    'datos': 'Tus fuentes de datos están bien integradas. He detectado una oportunidad para enriquecer el análisis conectando con APIs de mercado en tiempo real y añadiendo sensores IoT para mayor granularidad.'
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simular respuesta de IA
    setTimeout(() => {
      const messageKey = Object.keys(predefinedResponses).find(key => 
        newMessage.toLowerCase().includes(key)
      );
      
      const response = messageKey 
        ? predefinedResponses[messageKey]
        : 'Interesante pregunta. Basándome en los datos de tu Digital Twin, puedo generar un análisis detallado. ¿Podrías ser más específico sobre qué aspecto te interesa más?';

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    setNewMessage(suggestion.text);
    sendMessage();
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: '¡Hola! Soy tu asistente de IA para el Digital Twin. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
      }
    ]);
  };

  if (isMinimized) {
    return (
      <div className="ai-chat-minimized">
        <style jsx>{`
          .ai-chat-minimized {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
            z-index: 1000;
            transition: all 0.3s ease;
          }
          .ai-chat-minimized:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 32px rgba(59, 130, 246, 0.5);
          }
          .notification-badge {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 18px;
            height: 18px;
            background: #ef4444;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 600;
            color: white;
            border: 2px solid white;
          }
        `}</style>
        <MessageCircle size={24} color="white" onClick={onToggleMinimize} />
        <div className="notification-badge">3</div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .ai-chat-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 380px;
          height: 600px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e5e8eb;
        }

        .chat-header {
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          font-weight: 600;
        }

        .bot-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .header-btn {
          padding: 6px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .header-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message {
          display: flex;
          gap: 12px;
          max-width: 85%;
        }

        .message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bot-message-avatar {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        .user-message-avatar {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .message-content {
          background: #f8fafc;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
          color: #1a1d21;
          border: 1px solid #e5e8eb;
        }

        .message.user .message-content {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
        }

        .message-timestamp {
          font-size: 11px;
          color: #6b7684;
          margin-top: 4px;
          text-align: right;
        }

        .message.user .message-timestamp {
          text-align: left;
          color: rgba(255, 255, 255, 0.7);
        }

        .suggestions-grid {
          display: grid;
          gap: 8px;
          margin-top: 12px;
        }

        .suggestion-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          color: #374151;
          transition: all 0.2s ease;
        }

        .suggestion-btn:hover {
          background: #f0f8ff;
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .typing-indicator {
          display: flex;
          gap: 12px;
          padding: 0 4px;
        }

        .typing-dots {
          display: flex;
          gap: 4px;
          align-items: center;
          background: #f8fafc;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #e5e8eb;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background: #6b7684;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }

        .chat-input {
          padding: 16px;
          border-top: 1px solid #e5e8eb;
          background: #fafbfc;
        }

        .input-container {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }

        .input-field {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e5e8eb;
          border-radius: 24px;
          font-size: 14px;
          resize: none;
          background: white;
          max-height: 100px;
          min-height: 44px;
        }

        .input-field:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .send-btn {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .send-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .send-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .ai-chat-container {
            width: calc(100vw - 40px);
            height: calc(100vh - 40px);
            bottom: 20px;
            right: 20px;
          }
        }
      `}</style>

      <div className="ai-chat-container">
        <div className="chat-header">
          <div className="chat-title">
            <div className="bot-avatar">
              <Bot size={16} />
            </div>
            <div>
              <div>Asistente IA</div>
              <div style={{ fontSize: '12px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div className="status-indicator"></div>
                En línea
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button className="header-btn" onClick={clearChat} title="Limpiar chat">
              <RotateCcw size={16} />
            </button>
            <button className="header-btn" onClick={onToggleMinimize} title="Minimizar">
              <Minimize2 size={16} />
            </button>
            <button className="header-btn" onClick={onClose} title="Cerrar">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className={`message-avatar ${message.type === 'bot' ? 'bot-message-avatar' : 'user-message-avatar'}`}>
                {message.type === 'bot' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div>
                <div className="message-content">
                  {message.content}
                  {message.suggestions && (
                    <div className="suggestions-grid">
                      {message.suggestions.map((suggestion, index) => {
                        const IconComponent = suggestion.icon;
                        return (
                          <button
                            key={index}
                            className="suggestion-btn"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <IconComponent size={14} />
                            {suggestion.text}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="message-timestamp">
                  {message.timestamp.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="typing-indicator">
              <div className="bot-message-avatar message-avatar">
                <Bot size={16} />
              </div>
              <div className="typing-dots">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <div className="input-container">
            <textarea
              className="input-field"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Pregúntame sobre optimización, análisis de datos, riesgos..."
              rows="1"
            />
            <button 
              className="send-btn" 
              onClick={sendMessage}
              disabled={!newMessage.trim() || isTyping}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChat;