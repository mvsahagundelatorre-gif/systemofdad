import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const NavigationBar = ({ user, onNavigate, className = '' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: user?.role === 'executive' ? '/executive-dashboard' : '/employee-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'View activity reports and metrics',
      roles: ['employee', 'executive']
    },
    {
      label: 'New Report',
      path: '/client-report-form',
      icon: 'FileText',
      tooltip: 'Create new client report',
      roles: ['employee', 'executive']
    },
    {
      label: 'Reports',
      path: '/report-details-view',
      icon: 'FolderOpen',
      tooltip: 'View and manage reports',
      roles: ['employee', 'executive']
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredNavItems = navigationItems?.filter(item => 
    !item?.roles || item?.roles?.includes(user?.role)
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-card border-b border-border ${className}`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => handleNavigation(user?.role === 'executive' ? '/executive-dashboard' : '/employee-dashboard')}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
              >
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <Icon name="Building2" size={20} color="white" />
                </div>
                <span className="text-xl font-semibold text-foreground">
                  Enterprise Portal
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {filteredNavItems?.map((item) => {
                const isActive = location?.pathname === item?.path;
                return (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    title={item?.tooltip}
                  >
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.label}</span>
                  </button>
                );
              })}
            </div>

            {/* User Menu & Mobile Toggle */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {user?.role || 'Employee'}
                  </div>
                </div>
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="var(--color-muted-foreground)" />
                </div>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                iconName="LogOut"
                iconSize={16}
                className="hidden sm:flex"
              >
                Logout
              </Button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 right-0 bottom-0 w-64 bg-card border-l border-border shadow-lg">
            <div className="p-4 space-y-2">
              {/* User Info Mobile */}
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-md mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} color="white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {user?.role || 'Employee'}
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              {filteredNavItems?.map((item) => {
                const isActive = location?.pathname === item?.path;
                return (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item?.icon} size={18} />
                    <span>{item?.label}</span>
                  </button>
                );
              })}

              {/* Logout Button Mobile */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium text-error hover:bg-error/10 transition-all duration-200 mt-4 border-t border-border pt-6"
              >
                <Icon name="LogOut" size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationBar;