import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, Save, RefreshCw, Database, FileSpreadsheet, 
  Download, Upload, Link, Users, Shield, Monitor, 
  Edit3, Trash2, Plus, ChevronRight, ChevronDown,
  Workflow, Circle, ArrowRight, CheckCircle, Clock,
  AlertTriangle, Zap, Activity, Search, Filter, X,
  Key, Copy, Eye, EyeOff, Code, Globe, BarChart3,
  Book, Terminal, Lock, Unlock
} from 'lucide-react';

const Configuracion = () => {
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showApiKey, setShowApiKey] = useState({});
  const [config, setConfig] = useState({
    defaultFileFormat: 'xlsx',
    autoSync: true,
    notifications: true,
    dataRetention: 365,
    backupFrequency: 'daily',
    timezone: 'America/Mexico_City',
    language: 'es',
    currency: 'USD'
  });

  // Estado para API Keys
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Production Key',
      key: 'dt_prod_sk_1a2b3c4d5e6f7g8h9i0j',
      created: '2024-01-15',
      lastUsed: '2024-01-18T10:30:00Z',
      requests: 15420,
      status: 'active',
      permissions: ['read', 'write', 'admin'],
      rateLimit: 1000,
      environment: 'production'
    },
    {
      id: 2,
      name: 'Development Key',
      key: 'dt_dev_sk_9z8y7x6w5v4u3t2s1r0q',
      created: '2024-01-10',
      lastUsed: '2024-01-18T15:45:00Z',
      requests: 3250,
      status: 'active',
      permissions: ['read', 'write'],
      rateLimit: 100,
      environment: 'development'
    },
    {
      id: 3,
      name: 'Testing Key',
      key: 'dt_test_sk_p9o8i7u6y5t4r3e2w1q0',
      created: '2024-01-12',
      lastUsed: '2024-01-17T09:15:00Z',
      requests: 850,
      status: 'inactive',
      permissions: ['read'],
      rateLimit: 50,
      environment: 'testing'
    }
  ]);

  // Endpoints de la API
  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/v1/data/sources',
      description: 'Obtiene todas las fuentes de datos disponibles',
      category: 'Data Sources'
    },
    {
      method: 'POST',
      path: '/api/v1/data/sources',
      description: 'Crea una nueva fuente de datos',
      category: 'Data Sources'
    },
    {
      method: 'GET',
      path: '/api/v1/data/sources/{id}',
      description: 'Obtiene una fuente de datos específica',
      category: 'Data Sources'
    },
    {
      method: 'PUT',
      path: '/api/v1/data/sources/{id}',
      description: 'Actualiza una fuente de datos existente',
      category: 'Data Sources'
    },
    {
      method: 'DELETE',
      path: '/api/v1/data/sources/{id}',
      description: 'Elimina una fuente de datos',
      category: 'Data Sources'
    },
    {
      method: 'GET',
      path: '/api/v1/workflows',
      description: 'Lista todos los flujos de trabajo',
      category: 'Workflows'
    },
    {
      method: 'POST',
      path: '/api/v1/workflows',
      description: 'Crea un nuevo flujo de trabajo',
      category: 'Workflows'
    },
    {
      method: 'GET',
      path: '/api/v1/workflows/{id}/status',
      description: 'Obtiene el estado de un flujo específico',
      category: 'Workflows'
    },
    {
      method: 'GET',
      path: '/api/v1/integrations',
      description: 'Lista todas las integraciones disponibles',
      category: 'Integrations'
    },
    {
      method: 'POST',
      path: '/api/v1/integrations/{service}/connect',
      description: 'Conecta con un servicio externo',
      category: 'Integrations'
    },
    {
      method: 'GET',
      path: '/api/v1/analytics/dashboard',
      description: 'Obtiene datos para el dashboard principal',
      category: 'Analytics'
    },
    {
      method: 'GET',
      path: '/api/v1/analytics/reports',
      description: 'Lista todos los reportes disponibles',
      category: 'Analytics'
    }
  ];

  // Datos mejorados de flujos de tareas genéricos
  const [workflowData] = useState([
    {
      id: 1,
      phase: 'Planificación Inicial',
      duration: 30,
      cost: 150000,
      dependencies: [],
      resources: ['Project Manager', 'Analistas', 'Stakeholders'],
      status: 'active',
      progress: 78,
      type: 'planning'
    },
    {
      id: 2,
      phase: 'Análisis de Requisitos',
      duration: 45,
      cost: 200000,
      dependencies: [1],
      resources: ['Business Analysts', 'Subject Experts', 'Documentation'],
      status: 'planning',
      progress: 0,
      type: 'analysis'
    },
    {
      id: 3,
      phase: 'Diseño del Sistema',
      duration: 60,
      cost: 350000,
      dependencies: [2],
      resources: ['Arquitectos', 'Diseñadores', 'Software Engineers'],
      status: 'pending',
      progress: 0,
      type: 'design'
    },
    {
      id: 4,
      phase: 'Desarrollo e Implementación',
      duration: 120,
      cost: 800000,
      dependencies: [3],
      resources: ['Developers', 'QA Engineers', 'DevOps'],
      status: 'pending',
      progress: 0,
      type: 'development'
    },
    {
      id: 5,
      phase: 'Testing y Validación',
      duration: 45,
      cost: 180000,
      dependencies: [4],
      resources: ['QA Team', 'Test Engineers', 'End Users'],
      status: 'pending',
      progress: 0,
      type: 'testing'
    },
    {
      id: 6,
      phase: 'Despliegue Producción',
      duration: 15,
      cost: 120000,
      dependencies: [5],
      resources: ['DevOps', 'Infrastructure', 'Support Team'],
      status: 'pending',
      progress: 0,
      type: 'deployment'
    }
  ]);

  // Integraciones ampliadas con logos y categorías
  const [integrations] = useState([
    // ERP Systems
    { 
      name: 'SAP ERP', 
      status: 'connected', 
      lastSync: '2024-01-15T16:00:00Z', 
      format: 'API',
      logo: '🔷',
      category: 'ERP',
      description: 'Sistema de planificación empresarial líder mundial',
      pricing: 'Enterprise',
      features: ['Finanzas', 'RRHH', 'Logística', 'Producción']
    },
    { 
      name: 'Oracle ERP Cloud', 
      status: 'available', 
      lastSync: null, 
      format: 'REST API',
      logo: '🏛️',
      category: 'ERP',
      description: 'Suite completa de aplicaciones empresariales en la nube',
      pricing: 'Enterprise',
      features: ['Finanzas', 'SCM', 'HCM', 'Projects']
    },
    { 
      name: 'Microsoft Dynamics 365', 
      status: 'configured', 
      lastSync: '2024-01-15T15:30:00Z', 
      format: 'Graph API',
      logo: '🔵',
      category: 'ERP',
      description: 'Solución de negocio inteligente de Microsoft',
      pricing: 'Per User',
      features: ['Sales', 'Finance', 'Operations', 'Commerce']
    },
    
    // Analytics & BI
    { 
      name: 'Power BI', 
      status: 'connected', 
      lastSync: '2024-01-15T16:15:00Z', 
      format: 'Power BI API',
      logo: '📊',
      category: 'Analytics',
      description: 'Plataforma de análisis de datos de Microsoft',
      pricing: 'Per User',
      features: ['Dashboards', 'Reports', 'Real-time', 'Mobile']
    },
    { 
      name: 'Tableau', 
      status: 'available', 
      lastSync: null, 
      format: 'REST API',
      logo: '📈',
      category: 'Analytics',
      description: 'Visualización y análisis de datos empresariales',
      pricing: 'Per User',
      features: ['Visualization', 'Self-service', 'Prep', 'Server']
    },
    { 
      name: 'Google Analytics', 
      status: 'connected', 
      lastSync: '2024-01-15T16:05:00Z', 
      format: 'Analytics API',
      logo: '📱',
      category: 'Analytics',
      description: 'Análisis web y de aplicaciones móviles',
      pricing: 'Freemium',
      features: ['Web Analytics', 'Mobile', 'Attribution', 'Audiences']
    },
    { 
      name: 'Qlik Sense', 
      status: 'available', 
      lastSync: null, 
      format: 'Engine API',
      logo: '🎯',
      category: 'Analytics',
      description: 'Plataforma de analytics autoservicio moderna',
      pricing: 'Per User',
      features: ['Associative', 'Self-service', 'Augmented', 'Multi-cloud']
    },

    // Databases
    { 
      name: 'PostgreSQL', 
      status: 'connected', 
      lastSync: '2024-01-15T16:10:00Z', 
      format: 'JDBC',
      logo: '🐘',
      category: 'Database',
      description: 'Base de datos relacional open source avanzada',
      pricing: 'Open Source',
      features: ['ACID', 'JSON', 'Extensions', 'Replication']
    },
    { 
      name: 'MongoDB', 
      status: 'available', 
      lastSync: null, 
      format: 'MongoDB Driver',
      logo: '🍃',
      category: 'Database',
      description: 'Base de datos NoSQL orientada a documentos',
      pricing: 'Freemium',
      features: ['Document DB', 'Sharding', 'Replica Sets', 'Atlas']
    },
    { 
      name: 'Redis', 
      status: 'available', 
      lastSync: null, 
      format: 'Redis Protocol',
      logo: '🔴',
      category: 'Database',
      description: 'Estructura de datos en memoria para cache y broker',
      pricing: 'Open Source',
      features: ['In-memory', 'Pub/Sub', 'Lua Scripts', 'Clustering']
    },

    // Cloud Services
    { 
      name: 'AWS S3', 
      status: 'connected', 
      lastSync: '2024-01-15T16:20:00Z', 
      format: 'S3 API',
      logo: '☁️',
      category: 'Cloud',
      description: 'Almacenamiento de objetos escalable en la nube',
      pricing: 'Pay per use',
      features: ['Object Storage', 'Versioning', 'Lifecycle', 'Analytics']
    },
    { 
      name: 'Google Cloud Storage', 
      status: 'available', 
      lastSync: null, 
      format: 'Cloud Storage API',
      logo: '🌐',
      category: 'Cloud',
      description: 'Almacenamiento unificado de objetos para desarrolladores',
      pricing: 'Pay per use',
      features: ['Multi-regional', 'Coldline', 'Archive', 'Transfer']
    },
    { 
      name: 'Azure Blob Storage', 
      status: 'available', 
      lastSync: null, 
      format: 'Storage REST API',
      logo: '💠',
      category: 'Cloud',
      description: 'Almacenamiento de objetos masivamente escalable',
      pricing: 'Pay per use',
      features: ['Hot/Cool/Archive', 'Data Lake', 'Security', 'Analytics']
    },

    // Productivity
    { 
      name: 'Google Sheets', 
      status: 'connected', 
      lastSync: '2024-01-15T16:15:00Z', 
      format: 'Sheets API',
      logo: '📋',
      category: 'Productivity',
      description: 'Hojas de cálculo colaborativas en línea',
      pricing: 'Free/Business',
      features: ['Real-time', 'Collaboration', 'Apps Script', 'Add-ons']
    },
    { 
      name: 'Microsoft Excel Online', 
      status: 'configured', 
      lastSync: '2024-01-15T14:45:00Z', 
      format: 'Microsoft Graph',
      logo: '📗',
      category: 'Productivity',
      description: 'Hojas de cálculo de Microsoft en la nube',
      pricing: 'Per User',
      features: ['Co-authoring', 'Power Query', 'Macros', 'Templates']
    },
    { 
      name: 'Notion', 
      status: 'available', 
      lastSync: null, 
      format: 'Notion API',
      logo: '📝',
      category: 'Productivity',
      description: 'Workspace todo-en-uno para notas, tareas y wikis',
      pricing: 'Freemium',
      features: ['Blocks', 'Databases', 'Templates', 'Collaboration']
    },

    // Messaging & Communication
    { 
      name: 'Slack', 
      status: 'available', 
      lastSync: null, 
      format: 'Web API',
      logo: '💬',
      category: 'Communication',
      description: 'Plataforma de colaboración empresarial',
      pricing: 'Freemium',
      features: ['Channels', 'Apps', 'Workflows', 'Calls']
    },
    { 
      name: 'Microsoft Teams', 
      status: 'available', 
      lastSync: null, 
      format: 'Graph API',
      logo: '👥',
      category: 'Communication',
      description: 'Hub de colaboración en Microsoft 365',
      pricing: 'Per User',
      features: ['Chat', 'Meetings', 'Files', 'Apps']
    },

    // Project Management
    { 
      name: 'Jira', 
      status: 'available', 
      lastSync: null, 
      format: 'Jira REST API',
      logo: '🔷',
      category: 'Project Management',
      description: 'Seguimiento de proyectos y gestión ágil',
      pricing: 'Per User',
      features: ['Issues', 'Boards', 'Reports', 'Automation']
    },
    { 
      name: 'Asana', 
      status: 'available', 
      lastSync: null, 
      format: 'Asana API',
      logo: '🎯',
      category: 'Project Management',
      description: 'Gestión de trabajo y coordinación de equipos',
      pricing: 'Freemium',
      features: ['Tasks', 'Projects', 'Timeline', 'Goals']
    },
    { 
      name: 'Monday.com', 
      status: 'available', 
      lastSync: null, 
      format: 'Monday API',
      logo: '📅',
      category: 'Project Management',
      description: 'Sistema operativo de trabajo para equipos',
      pricing: 'Per User',
      features: ['Boards', 'Automations', 'Integrations', 'Dashboards']
    }
  ]);

  // Canvas drawing para workflow
  useEffect(() => {
    drawWorkflowCanvas();
  }, [workflowData]);

  const drawWorkflowCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    const nodeWidth = 160;
    const nodeHeight = 80;
    const spacing = 200;
    const startX = 50;
    const startY = 100;
    
    // Colors for different types
    const colors = {
      planning: '#3b82f6',
      analysis: '#f59e0b',
      design: '#22c55e',
      development: '#8b5cf6',
      testing: '#ef4444',
      deployment: '#06b6d4'
    };

    const statusColors = {
      active: '#22c55e',
      planning: '#f59e0b',
      pending: '#6b7280',
      completed: '#3b82f6'
    };

    workflowData.forEach((task, index) => {
      const x = startX + (index % 3) * spacing;
      const y = startY + Math.floor(index / 3) * 120;
      
      // Draw dependencies (arrows)
      task.dependencies.forEach(depId => {
        const depIndex = workflowData.findIndex(t => t.id === depId);
        if (depIndex !== -1) {
          const depX = startX + (depIndex % 3) * spacing + nodeWidth;
          const depY = startY + Math.floor(depIndex / 3) * 120 + nodeHeight / 2;
          
          ctx.strokeStyle = '#6b7280';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(depX, depY);
          ctx.lineTo(x, y + nodeHeight / 2);
          ctx.stroke();
          
          // Arrow head
          ctx.fillStyle = '#6b7280';
          ctx.beginPath();
          ctx.moveTo(x - 10, y + nodeHeight / 2 - 5);
          ctx.lineTo(x, y + nodeHeight / 2);
          ctx.lineTo(x - 10, y + nodeHeight / 2 + 5);
          ctx.fill();
        }
      });
      
      // Draw node
      ctx.fillStyle = colors[task.type];
      ctx.fillRect(x, y, nodeWidth, nodeHeight);
      
      // Status indicator
      ctx.fillStyle = statusColors[task.status];
      ctx.fillRect(x + nodeWidth - 20, y + 10, 10, 10);
      
      // Progress bar
      if (task.progress > 0) {
        ctx.fillStyle = '#e5e7eb';
        ctx.fillRect(x + 10, y + nodeHeight - 15, nodeWidth - 20, 5);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(x + 10, y + nodeHeight - 15, (nodeWidth - 20) * (task.progress / 100), 5);
      }
      
      // Text
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      
      // Phase name (wrapped)
      const words = task.phase.split(' ');
      const maxWidth = nodeWidth - 20;
      let line = '';
      let lines = [];
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line !== '') {
          lines.push(line);
          line = word + ' ';
        } else {
          line = testLine;
        }
      });
      lines.push(line);
      
      lines.forEach((line, lineIndex) => {
        ctx.fillText(line.trim(), x + nodeWidth / 2, y + 25 + lineIndex * 14);
      });
      
      // Duration and cost
      ctx.font = '10px Arial';
      ctx.fillText(`${task.duration} días`, x + nodeWidth / 2, y + 55);
      ctx.fillText(`$${(task.cost / 1000).toFixed(0)}K`, x + nodeWidth / 2, y + 68);
    });
  };

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const saveConfiguration = () => {
    console.log('Guardando configuración:', config);
  };

  const generateApiKey = () => {
    const environments = ['production', 'development', 'testing'];
    const randomEnv = environments[Math.floor(Math.random() * environments.length)];
    const newKey = {
      id: apiKeys.length + 1,
      name: `New ${randomEnv} Key`,
      key: `dt_${randomEnv.slice(0,4)}_sk_${Math.random().toString(36).substring(2, 22)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: null,
      requests: 0,
      status: 'active',
      permissions: ['read'],
      rateLimit: randomEnv === 'production' ? 1000 : randomEnv === 'development' ? 100 : 50,
      environment: randomEnv
    };
    setApiKeys(prev => [...prev, newKey]);
  };

  const toggleApiKeyVisibility = (keyId) => {
    setShowApiKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Aquí podrías añadir una notificación de "copiado"
  };

  const deleteApiKey = (keyId) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
  };

  const updateApiKeyStatus = (keyId, newStatus) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, status: newStatus } : key
    ));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle size={16} color="#22c55e" />;
      case 'disconnected': return <Circle size={16} color="#ef4444" />;
      case 'configured': return <Clock size={16} color="#f59e0b" />;
      case 'available': return <Plus size={16} color="#3b82f6" />;
      default: return <AlertTriangle size={16} color="#6b7280" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'planning': return <Workflow size={16} />;
      case 'analysis': return <Search size={16} />;
      case 'design': return <Edit3 size={16} />;
      case 'development': return <Settings size={16} />;
      case 'testing': return <Shield size={16} />;
      case 'deployment': return <Upload size={16} />;
      default: return <Settings size={16} />;
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return '#22c55e';
      case 'POST': return '#3b82f6';
      case 'PUT': return '#f59e0b';
      case 'DELETE': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || integration.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(integrations.map(int => int.category))];

  return (
    <>
      <style jsx>{`
        .config-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .config-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e8eb;
        }

        .header-left h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #1a1d21;
        }

        .header-subtitle {
          font-size: 14px;
          color: #6b7684;
          margin: 0;
        }

        .config-tabs {
          display: flex;
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          margin-bottom: 24px;
          overflow: hidden;
        }

        .tab-button {
          padding: 12px 20px;
          border: none;
          background: none;
          font-size: 14px;
          font-weight: 500;
          color: #6b7684;
          cursor: pointer;
          transition: all 0.2s ease;
          border-right: 1px solid #e5e8eb;
        }

        .tab-button:last-child {
          border-right: none;
        }

        .tab-button:hover {
          background: #f8f9fa;
          color: #1a1d21;
        }

        .tab-button.active {
          background: #0066cc;
          color: white;
        }

        .config-content {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          padding: 24px;
        }

        .config-section {
          margin-bottom: 32px;
        }

        .config-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d21;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .config-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .config-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .config-label {
          font-size: 13px;
          font-weight: 500;
          color: #1a1d21;
        }

        .config-input {
          height: 36px;
          padding: 0 12px;
          border: 1px solid #e5e8eb;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .config-input:focus {
          outline: none;
          border-color: #0066cc;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .config-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        .toggle-switch {
          position: relative;
          width: 44px;
          height: 24px;
          background: #e5e8eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toggle-switch.active {
          background: #0066cc;
        }

        .toggle-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .toggle-switch.active .toggle-knob {
          transform: translateX(20px);
        }

        .integrations-controls {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          align-items: center;
        }

        .search-container {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-input {
          width: 100%;
          padding: 10px 16px 10px 40px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7684;
        }

        .filter-select {
          padding: 10px 12px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          color: #374151;
        }

        .integrations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .integration-card {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .integration-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--category-color);
        }

        .integration-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .integration-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .integration-info {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .integration-logo {
          font-size: 32px;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e5e8eb;
        }

        .integration-details h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 4px 0;
        }

        .integration-category {
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: var(--category-color);
          color: white;
          display: inline-block;
        }

        .integration-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .integration-description {
          font-size: 13px;
          color: #6b7684;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .integration-features {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }

        .feature-tag {
          padding: 2px 6px;
          background: #f1f5f9;
          color: #64748b;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 500;
        }

        .integration-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pricing-info {
          font-size: 12px;
          color: #6b7684;
          font-weight: 500;
        }

        .integration-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 6px 12px;
          border: 1px solid #e5e8eb;
          border-radius: 6px;
          background: white;
          color: #6b7684;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .action-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #374151;
        }

        .action-btn.primary {
          background: var(--category-color);
          color: white;
          border-color: var(--category-color);
        }

        .action-btn.primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .api-keys-grid {
          display: grid;
          gap: 16px;
        }

        .api-key-card {
          background: white;
          border: 1px solid #e5e8eb;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .api-key-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .api-key-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .api-key-info h4 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #1a1d21;
        }

        .api-key-environment {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .env-production {
          background: #dcfce7;
          color: #16a34a;
        }

        .env-development {
          background: #dbeafe;
          color: #2563eb;
        }

        .env-testing {
          background: #fef3c7;
          color: #d97706;
        }

        .api-key-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .api-key-value {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 13px;
        }

        .api-key-text {
          flex: 1;
          color: #374151;
          letter-spacing: 0.5px;
        }

        .api-key-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .api-stat {
          text-align: center;
        }

        .api-stat-value {
          font-size: 18px;
          font-weight: 600;
          color: #1a1d21;
          margin-bottom: 4px;
        }

        .api-stat-label {
          font-size: 11px;
          color: #6b7684;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .api-key-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .endpoints-grid {
          display: grid;
          gap: 2px;
          margin-top: 16px;
        }

        .endpoint-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: #f8fafc;
          border: 1px solid #e5e8eb;
          transition: all 0.2s ease;
        }

        .endpoint-item:first-child {
          border-radius: 8px 8px 0 0;
        }

        .endpoint-item:last-child {
          border-radius: 0 0 8px 8px;
        }

        .endpoint-item:only-child {
          border-radius: 8px;
        }

        .endpoint-item:hover {
          background: #f1f5f9;
        }

        .endpoint-method {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          min-width: 60px;
          text-align: center;
          margin-right: 12px;
        }

        .endpoint-path {
          flex: 1;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 13px;
          color: #374151;
          margin-right: 12px;
        }

        .endpoint-description {
          flex: 2;
          font-size: 13px;
          color: #6b7684;
        }

        .workflow-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          overflow: hidden;
          margin-top: 16px;
        }

        .workflow-table th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #6b7684;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e5e8eb;
        }

        .workflow-table td {
          padding: 12px;
          border-bottom: 1px solid #f1f3f5;
          font-size: 13px;
          color: #1a1d21;
        }

        .workflow-table tr:last-child td {
          border-bottom: none;
        }

        .workflow-table tr:hover {
          background: #f8f9fa;
        }

        .phase-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .type-badge {
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .type-planning { background: #dbeafe; color: #2563eb; }
        .type-analysis { background: #fef3c7; color: #d97706; }
        .type-design { background: #dcfce7; color: #16a34a; }
        .type-development { background: #f3e8ff; color: #7c3aed; }
        .type-testing { background: #fee2e2; color: #dc2626; }
        .type-deployment { background: #ecfeff; color: #0891b2; }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-active {
          background: #dcfce7;
          color: #16a34a;
        }

        .status-planning {
          background: #fef3c7;
          color: #d97706;
        }

        .status-pending {
          background: #f1f5f9;
          color: #64748b;
        }

        .status-inactive {
          background: #fee2e2;
          color: #dc2626;
        }

        .progress-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 100px;
        }

        .progress-bar {
          flex: 1;
          height: 4px;
          background: #f1f3f5;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0066cc, #0052a3);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 11px;
          font-weight: 500;
          color: #6b7684;
          min-width: 30px;
        }

        .canvas-container {
          margin-top: 24px;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          padding: 20px;
          background: #fafbfc;
          overflow-x: auto;
        }

        .workflow-canvas {
          border: 1px solid #e5e8eb;
          border-radius: 6px;
          background: white;
          width: 100%;
          min-width: 800px;
          height: 400px;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e5e8eb;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
        }

        .btn-primary {
          background: #0066cc;
          color: white;
        }

        .btn-primary:hover {
          background: #0052a3;
        }

        .btn-secondary {
          background: white;
          color: #6b7684;
          border: 1px solid #e5e8eb;
        }

        .btn-secondary:hover {
          background: #f8f9fa;
          border-color: #d0d5db;
        }

        .btn-success {
          background: #22c55e;
          color: white;
        }

        .btn-success:hover {
          background: #16a34a;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .canvas-legend {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6b7684;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .info-panel {
          background: #f8fafc;
          border: 1px solid #e5e8eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .info-title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .info-content {
          font-size: 13px;
          color: #6b7684;
          line-height: 1.5;
        }

        .endpoint-category {
          background: #f1f5f9;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          padding: 8px 16px;
          border-bottom: 1px solid #e5e8eb;
        }

        @media (max-width: 768px) {
          .config-tabs {
            flex-direction: column;
          }

          .tab-button {
            border-right: none;
            border-bottom: 1px solid #e5e8eb;
          }

          .config-grid,
          .integrations-grid {
            grid-template-columns: 1fr;
          }

          .integrations-controls {
            flex-direction: column;
          }

          .canvas-container {
            padding: 12px;
          }

          .workflow-canvas {
            min-width: 600px;
            height: 300px;
          }

          .api-key-actions,
          .action-buttons {
            flex-wrap: wrap;
          }

          .endpoint-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .endpoint-method {
            margin-right: 0;
          }
        }
      `}</style>

      <div className="config-container">
        <div className="config-header">
          <div className="header-left">
            <h1>Configuración del Sistema</h1>
            <p className="header-subtitle">
              Administración y personalización de la plataforma Digital Twin
            </p>
          </div>
        </div>

        <div className="config-tabs">
          <button 
            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            Configuración General
          </button>
          <button 
            className={`tab-button ${activeTab === 'workflows' ? 'active' : ''}`}
            onClick={() => setActiveTab('workflows')}
          >
            Flujos de Trabajo
          </button>
          <button 
            className={`tab-button ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            Integraciones
          </button>
          <button 
            className={`tab-button ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            API y Desarrollo
          </button>
        </div>

        <div className="config-content">
          {activeTab === 'general' && (
            <>
              <div className="config-section">
                <h3 className="section-title">
                  <FileSpreadsheet size={20} />
                  Configuración de Archivos
                </h3>
                <div className="config-grid">
                  <div className="config-item">
                    <label className="config-label">Formato de Archivo Predeterminado</label>
                    <select 
                      className="config-input"
                      value={config.defaultFileFormat}
                      onChange={(e) => handleConfigChange('defaultFileFormat', e.target.value)}
                    >
                      <option value="xlsx">Excel (.xlsx)</option>
                      <option value="csv">CSV (.csv)</option>
                      <option value="xls">Excel Legacy (.xls)</option>
                      <option value="sheets">Google Sheets</option>
                    </select>
                  </div>
                  
                  <div className="config-item">
                    <label className="config-label">Retención de Datos (días)</label>
                    <input 
                      type="number"
                      className="config-input"
                      value={config.dataRetention}
                      onChange={(e) => handleConfigChange('dataRetention', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="config-item">
                    <label className="config-label">Frecuencia de Respaldo</label>
                    <select 
                      className="config-input"
                      value={config.backupFrequency}
                      onChange={(e) => handleConfigChange('backupFrequency', e.target.value)}
                    >
                      <option value="hourly">Cada Hora</option>
                      <option value="daily">Diario</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="config-section">
                <h3 className="section-title">
                  <Settings size={20} />
                  Configuración del Sistema
                </h3>
                <div className="config-grid">
                  <div className="config-item">
                    <label className="config-label">Zona Horaria</label>
                    <select 
                      className="config-input"
                      value={config.timezone}
                      onChange={(e) => handleConfigChange('timezone', e.target.value)}
                    >
                      <option value="America/Mexico_City">México (GMT-6)</option>
                      <option value="America/New_York">Nueva York (GMT-5)</option>
                      <option value="America/Los_Angeles">Los Ángeles (GMT-8)</option>
                      <option value="UTC">UTC (GMT+0)</option>
                    </select>
                  </div>

                  <div className="config-item">
                    <label className="config-label">Idioma</label>
                    <select 
                      className="config-input"
                      value={config.language}
                      onChange={(e) => handleConfigChange('language', e.target.value)}
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>

                  <div className="config-item">
                    <label className="config-label">Moneda</label>
                    <select 
                      className="config-input"
                      value={config.currency}
                      onChange={(e) => handleConfigChange('currency', e.target.value)}
                    >
                      <option value="USD">USD - Dólar Americano</option>
                      <option value="MXN">MXN - Peso Mexicano</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>
                </div>

                <div className="config-grid" style={{marginTop: '20px'}}>
                  <div className="config-item">
                    <label className="config-label">Sincronización Automática</label>
                    <div className="config-toggle">
                      <div 
                        className={`toggle-switch ${config.autoSync ? 'active' : ''}`}
                        onClick={() => handleConfigChange('autoSync', !config.autoSync)}
                      >
                        <div className="toggle-knob"></div>
                      </div>
                      <span style={{fontSize: '13px', color: '#6b7684'}}>
                        {config.autoSync ? 'Activado' : 'Desactivado'}
                      </span>
                    </div>
                  </div>

                  <div className="config-item">
                    <label className="config-label">Notificaciones</label>
                    <div className="config-toggle">
                      <div 
                        className={`toggle-switch ${config.notifications ? 'active' : ''}`}
                        onClick={() => handleConfigChange('notifications', !config.notifications)}
                      >
                        <div className="toggle-knob"></div>
                      </div>
                      <span style={{fontSize: '13px', color: '#6b7684'}}>
                        {config.notifications ? 'Activado' : 'Desactivado'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'workflows' && (
            <>
              <div className="config-section">
                <h3 className="section-title">
                  <Workflow size={20} />
                  Datos de Flujos de Trabajo
                </h3>
                
                <table className="workflow-table">
                  <thead>
                    <tr>
                      <th>Fase</th>
                      <th>Tipo</th>
                      <th>Duración</th>
                      <th>Costo</th>
                      <th>Estado</th>
                      <th>Progreso</th>
                      <th>Recursos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflowData.map((task) => (
                      <tr key={task.id}>
                        <td>
                          <div className="phase-cell">
                            {getTypeIcon(task.type)}
                            {task.phase}
                          </div>
                        </td>
                        <td>
                          <span className={`type-badge type-${task.type}`}>
                            {task.type}
                          </span>
                        </td>
                        <td>{task.duration} días</td>
                        <td>${(task.cost / 1000).toFixed(0)}K</td>
                        <td>
                          <span className={`status-badge status-${task.status}`}>
                            {task.status === 'active' ? 'Activo' : 
                             task.status === 'planning' ? 'Planificación' : 'Pendiente'}
                          </span>
                        </td>
                        <td>
                          <div className="progress-cell">
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                            <span className="progress-text">{task.progress}%</span>
                          </div>
                        </td>
                        <td style={{fontSize: '11px', color: '#6b7684'}}>
                          {task.resources.slice(0, 2).join(', ')}
                          {task.resources.length > 2 && ` +${task.resources.length - 2}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="config-section">
                <h3 className="section-title">
                  <Monitor size={20} />
                  Canvas de Proceso de Tareas
                </h3>
                
                <div className="canvas-legend">
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#3b82f6'}}></div>
                    <span>Planificación</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#f59e0b'}}></div>
                    <span>Análisis</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#22c55e'}}></div>
                    <span>Diseño</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#8b5cf6'}}></div>
                    <span>Desarrollo</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#ef4444'}}></div>
                    <span>Testing</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{background: '#06b6d4'}}></div>
                    <span>Despliegue</span>
                  </div>
                </div>

                <div className="canvas-container">
                  <canvas 
                    ref={canvasRef}
                    className="workflow-canvas"
                    width={800}
                    height={400}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'integrations' && (
            <div className="config-section">
              <h3 className="section-title">
                <Database size={20} />
                Integraciones del Sistema
              </h3>
              
              <div className="integrations-controls">
                <div className="search-container">
                  <Search className="search-icon" size={16} />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar integraciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="filter-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {searchTerm && (
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setSearchTerm('')}
                  >
                    <X size={14} />
                    Limpiar
                  </button>
                )}
              </div>

              <div className="integrations-grid">
                {filteredIntegrations.map((integration, index) => {
                  const categoryColors = {
                    'ERP': '#3b82f6',
                    'Analytics': '#10b981',
                    'Database': '#f59e0b',
                    'Cloud': '#8b5cf6',
                    'Productivity': '#06b6d4',
                    'Communication': '#ef4444',
                    'Project Management': '#22c55e'
                  };
                  
                  return (
                    <div 
                      key={index} 
                      className="integration-card"
                      style={{ '--category-color': categoryColors[integration.category] || '#6b7280' }}
                    >
                      <div className="integration-header">
                        <div className="integration-info">
                          <div className="integration-logo">{integration.logo}</div>
                          <div className="integration-details">
                            <h3>{integration.name}</h3>
                            <div className="integration-category">
                              {integration.category}
                            </div>
                          </div>
                        </div>
                        <div className="integration-status">
                          {getStatusIcon(integration.status)}
                          {integration.status === 'connected' ? 'Conectado' : 
                           integration.status === 'configured' ? 'Configurado' :
                           integration.status === 'available' ? 'Disponible' : 'Desconectado'}
                        </div>
                      </div>

                      <p className="integration-description">{integration.description}</p>

                      <div className="integration-features">
                        {integration.features.map((feature, idx) => (
                          <span key={idx} className="feature-tag">{feature}</span>
                        ))}
                      </div>

                      <div className="integration-footer">
                        <div className="pricing-info">
                          Pricing: {integration.pricing}
                        </div>
                        <div className="integration-actions">
                          {integration.status === 'connected' ? (
                            <>
                              <button className="action-btn">
                                <Settings size={12} />
                                Config
                              </button>
                              <button className="action-btn">
                                <RefreshCw size={12} />
                                Sync
                              </button>
                            </>
                          ) : (
                            <button 
                              className="action-btn primary"
                              style={{ background: categoryColors[integration.category] }}
                            >
                              <Plus size={12} />
                              Conectar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <>
              <div className="info-panel">
                <div className="info-title">
                  <Globe size={16} />
                  Información de la API
                </div>
                <div className="info-content">
                  La API de Digital Twin Platform proporciona acceso programático a todas las funcionalidades principales de la plataforma. 
                  Utiliza autenticación mediante API Keys y sigue los estándares REST con respuestas en formato JSON.
                  <br /><br />
                  <strong>Base URL:</strong> https://api.digitaltwin.platform/v1
                </div>
              </div>

              <div className="config-section">
                <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 className="section-title">
                    <Key size={20} />
                    Gestión de API Keys
                  </h3>
                </div>

                <div className="api-keys-grid">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="api-key-card">
                      <div className="api-key-header">
                        <div className="api-key-info">
                          <h4>{apiKey.name}</h4>
                          <span className={`api-key-environment env-${apiKey.environment}`}>
                            {apiKey.environment}
                          </span>
                        </div>
                        <div className="api-key-status">
                          {apiKey.status === 'active' ? 
                            <CheckCircle size={16} color="#22c55e" /> :
                            <Circle size={16} color="#ef4444" />
                          }
                          {apiKey.status === 'active' ? 'Activa' : 'Inactiva'}
                        </div>
                      </div>

                      <div className="api-key-value">
                        <span className="api-key-text">
                          {showApiKey[apiKey.id] ? apiKey.key : '*'.repeat(apiKey.key.length)}
                        </span>
                        <button 
                          className="action-btn"
                          onClick={() => toggleApiKeyVisibility(apiKey.id)}
                        >
                          {showApiKey[apiKey.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button 
                          className="action-btn"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy size={14} />
                        </button>
                      </div>

                      <div className="api-key-stats">
                        <div className="api-stat">
                          <div className="api-stat-value">{apiKey.requests.toLocaleString()}</div>
                          <div className="api-stat-label">Requests</div>
                        </div>
                        <div className="api-stat">
                          <div className="api-stat-value">{apiKey.rateLimit}/h</div>
                          <div className="api-stat-label">Rate Limit</div>
                        </div>
                        <div className="api-stat">
                          <div className="api-stat-value">{apiKey.created}</div>
                          <div className="api-stat-label">Created</div>
                        </div>
                        <div className="api-stat">
                          <div className="api-stat-value">
                            {apiKey.lastUsed ? 
                              new Date(apiKey.lastUsed).toLocaleDateString() : 
                              'Never'
                            }
                          </div>
                          <div className="api-stat-label">Last Used</div>
                        </div>
                      </div>

                      <div className="api-key-actions">
                        <button className="action-btn">
                          <Settings size={14} />
                          Configurar
                        </button>
                        {apiKey.status === 'active' ? (
                          <button 
                            className="action-btn"
                            onClick={() => updateApiKeyStatus(apiKey.id, 'inactive')}
                          >
                            <Lock size={14} />
                            Desactivar
                          </button>
                        ) : (
                          <button 
                            className="action-btn"
                            onClick={() => updateApiKeyStatus(apiKey.id, 'active')}
                          >
                            <Unlock size={14} />
                            Activar
                          </button>
                        )}
                        <button 
                          className="action-btn"
                          style={{ color: '#ef4444', borderColor: '#fee2e2' }}
                          onClick={() => deleteApiKey(apiKey.id)}
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="config-section">
                <h3 className="section-title">
                  <Terminal size={20} />
                  Endpoints Disponibles
                </h3>

                <div className="endpoints-grid">
                  {['Data Sources', 'Workflows', 'Integrations', 'Analytics'].map((category) => (
                    <div key={category}>
                      <div className="endpoint-category">{category}</div>
                      {apiEndpoints
                        .filter(endpoint => endpoint.category === category)
                        .map((endpoint, index) => (
                          <div key={index} className="endpoint-item">
                            <span 
                              className="endpoint-method"
                              style={{ 
                                backgroundColor: getMethodColor(endpoint.method), 
                                color: 'white' 
                              }}
                            >
                              {endpoint.method}
                            </span>
                            <span className="endpoint-path">{endpoint.path}</span>
                            <span className="endpoint-description">{endpoint.description}</span>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="config-section">
                <h3 className="section-title">
                  <Book size={20} />
                  Documentación Rápida
                </h3>
                
                <div className="info-panel">
                  <div className="info-title">
                    <Code size={16} />
                    Autenticación
                  </div>
                  <div className="info-content">
                    <strong>Header requerido:</strong><br />
                    <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px' }}>
                      Authorization: Bearer YOUR_API_KEY
                    </code>
                    <br /><br />
                    <strong>Ejemplo de solicitud:</strong><br />
                    <pre style={{ background: '#f1f5f9', padding: '12px', borderRadius: '6px', fontSize: '12px', overflow: 'auto' }}>
{`curl -X GET "https://api.digitaltwin.platform/v1/data/sources" \\
  -H "Authorization: Bearer dt_prod_sk_1a2b3c4d5e6f7g8h9i0j" \\
  -H "Content-Type: application/json"`}
                    </pre>
                  </div>
                </div>

                <div className="info-panel">
                  <div className="info-title">
                    <BarChart3 size={16} />
                    Rate Limiting
                  </div>
                  <div className="info-content">
                    Los límites de velocidad se aplican por API Key y se basan en el entorno:
                    <ul style={{ marginTop: '8px', paddingLeft: '16px' }}>
                      <li><strong>Production:</strong> 1000 requests/hora</li>
                      <li><strong>Development:</strong> 100 requests/hora</li>
                      <li><strong>Testing:</strong> 50 requests/hora</li>
                    </ul>
                    Los headers de respuesta incluyen información sobre el límite actual.
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="action-buttons">
            <button className="btn btn-secondary">
              <RefreshCw size={16} />
              Restaurar Valores
            </button>
            <button className="btn btn-primary" onClick={saveConfiguration}>
              <Save size={16} />
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Configuracion;