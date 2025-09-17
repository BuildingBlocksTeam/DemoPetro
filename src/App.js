import React, { useState, useRef } from 'react';
import { 
  BarChart3, FolderPlus, Settings, Users, Database, 
  Bell, Search, Plus, ChevronDown, Menu, X 
} from 'lucide-react';

// Importamos los componentes
import NavigationMenu from './NavigationMenu';
import Dashboard from './Dashboard';
import GestionProyectos from './GestionProyectos';
import Configuracion from './Configuracion';
import DataManagement from './DataManagement'; // NUEVO COMPONENTE

const DTApp = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user] = useState({
    name: "Dr. Carlos Mendoza",
    role: "Director de Operaciones",
    avatar: "CM",
    notifications: 3
  });

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Centro de Control', 
      icon: BarChart3,
      notifications: 0
    },
    { 
      id: 'projects', 
      label: 'Gestión de Proyectos', 
      icon: FolderPlus,
      notifications: 2
    },
    { 
      id: 'data', 
      label: 'Fuentes de Datos', 
      icon: Database,
      notifications: 0
    },
    { 
      id: 'configuration', 
      label: 'Configuración', 
      icon: Settings,
      notifications: 0
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <GestionProyectos />;
      case 'data':
        return <DataManagement />;
      case 'configuration':
        return <Configuracion />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="dt-app">
      <style jsx>{`
        .dt-app {
          display: flex;
          height: 100vh;
          background: #fafbfc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          color: #1a1d21;
        }

        .main-layout {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .top-bar {
          height: 64px;
          background: white;
          border-bottom: 1px solid #e5e8eb;
          display: flex;
          align-items: center;
          justify-content: between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .top-bar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: #6b7684;
        }

        .page-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0;
        }

        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-left: auto;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          width: 280px;
          height: 36px;
          padding: 0 16px 0 40px;
          border: 1px solid #e5e8eb;
          border-radius: 6px;
          font-size: 14px;
          background: #f8f9fa;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #0066cc;
          background: white;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #6b7684;
          pointer-events: none;
        }

        .notification-btn {
          position: relative;
          background: none;
          border: none;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          color: #6b7684;
          transition: all 0.2s ease;
        }

        .notification-btn:hover {
          background: #f1f3f5;
          color: #1a1d21;
        }

        .notification-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 16px;
          height: 16px;
          background: #dc3545;
          color: white;
          border-radius: 50%;
          font-size: 10px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-menu:hover {
          background: #f1f3f5;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #0066cc, #004d99);
          color: white;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .user-name {
          font-size: 13px;
          font-weight: 500;
          color: #1a1d21;
          line-height: 1.2;
        }

        .user-role {
          font-size: 11px;
          color: #6b7684;
          line-height: 1.2;
        }

        .main-content {
          flex: 1;
          overflow-y: auto;
          background: #fafbfc;
          padding: 24px;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          display: none;
        }

        .overlay.open {
          display: block;
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }
          
          .search-input {
            width: 200px;
          }
          
          .user-info {
            display: none;
          }
          
          .main-content {
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .search-container {
            display: none;
          }
          
          .search-input {
            width: 150px;
          }
        }
      `}</style>

      <div className="main-layout">
        <NavigationMenu 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          navigationItems={navigationItems}
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="content-area">
          <div className="top-bar">
            <div className="top-bar-left">
              <button 
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </button>
              
              <h1 className="page-title">
                {navigationItems.find(item => item.id === activeSection)?.label}
              </h1>
            </div>

            <div className="top-bar-right">
              <div className="search-container">
                <Search className="search-icon" size={16} />
                <input 
                  type="text" 
                  className="search-input"
                  placeholder="Buscar proyectos, datos, usuarios..."
                />
              </div>

              <button className="notification-btn">
                <Bell size={18} />
                {user.notifications > 0 && (
                  <span className="notification-badge">{user.notifications}</span>
                )}
              </button>

            </div>
          </div>

          <div className="main-content">
            {renderContent()}
          </div>
        </div>

        <div className={`overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      </div>
    </div>
  );
};

export default DTApp;