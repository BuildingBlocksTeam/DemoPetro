import React from 'react';
import { Activity, X } from 'lucide-react';

const NavigationMenu = ({ 
  activeSection, 
  setActiveSection, 
  navigationItems, 
  user, 
  isOpen, 
  onClose 
}) => {
  return (
    <>
      <style jsx>{`
        .navigation-sidebar {
          width: 260px;
          background: #1a1d21;
          color: white;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #2a2d33;
          position: relative;
          z-index: 1000;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #2a2d33;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #0066cc, #004d99);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text h1 {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          color: white;
        }

        .logo-text p {
          font-size: 12px;
          color: #8b949e;
          margin: 0;
          margin-top: 2px;
        }

        .close-btn {
          display: none;
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: #8b949e;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #2a2d33;
          color: white;
        }

        .navigation-menu {
          flex: 1;
          padding: 8px 0;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          margin: 0 8px;
          border-radius: 6px;
          cursor: pointer;
          color: #8b949e;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          position: relative;
          border: none;
          background: none;
          width: calc(100% - 16px);
          text-align: left;
        }

        .nav-item:hover {
          background: #2a2d33;
          color: #e6edf3;
        }

        .nav-item.active {
          background: #0066cc;
          color: white;
        }

        .nav-item.active:hover {
          background: #0052a3;
        }

        .nav-notification {
          margin-left: auto;
          background: #dc3545;
          color: white;
          border-radius: 10px;
          padding: 2px 6px;
          font-size: 10px;
          font-weight: 600;
          min-width: 16px;
          text-align: center;
        }

        .sidebar-footer {
          padding: 16px 20px;
          border-top: 1px solid #2a2d33;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 6px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .user-profile:hover {
          background: #2a2d33;
        }

        .user-profile-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #0066cc, #004d99);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }

        .user-profile-info h4 {
          font-size: 13px;
          font-weight: 500;
          margin: 0;
          color: #e6edf3;
          line-height: 1.2;
        }

        .user-profile-info p {
          font-size: 11px;
          color: #8b949e;
          margin: 0;
          line-height: 1.2;
        }

        @media (max-width: 768px) {
          .navigation-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 1001;
          }

          .navigation-sidebar.open {
            transform: translateX(0);
          }

          .close-btn {
            display: block;
          }
        }
      `}</style>

      <div className={`navigation-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <Activity size={20} />
            </div>
            <div className="logo-text">
              <h1>DigitalTwin</h1>
              <p>Platform</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <nav className="navigation-menu">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveSection(item.id);
                  onClose();
                }}
              >
                <Icon size={18} />
                {item.label}
                {item.notifications > 0 && (
                  <span className="nav-notification">{item.notifications}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-profile-avatar">{user.avatar}</div>
            <div className="user-profile-info">
              <h4>{user.name}</h4>
              <p>{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationMenu;