import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatus = ({ className = '' }) => {
  const [systemStatus, setSystemStatus] = useState({
    status: 'operational',
    lastUpdate: new Date(),
    uptime: '99.9%'
  });

  useEffect(() => {
    // Simulate system status check
    const checkSystemStatus = () => {
      setSystemStatus({
        status: 'operational',
        lastUpdate: new Date(),
        uptime: '99.9%'
      });
    };

    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-success';
      case 'maintenance':
        return 'text-warning';
      case 'down':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return 'CheckCircle';
      case 'maintenance':
        return 'AlertTriangle';
      case 'down':
        return 'XCircle';
      default:
        return 'HelpCircle';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'operational':
        return 'Sistema Operativo';
      case 'maintenance':
        return 'Mantenimiento';
      case 'down':
        return 'Sistema No Disponible';
      default:
        return 'Estado Desconocido';
    }
  };

  return (
    <div className={`bg-muted/30 rounded-lg p-4 border border-border ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon 
            name={getStatusIcon(systemStatus?.status)} 
            size={20} 
            color={`var(--color-${systemStatus?.status === 'operational' ? 'success' : systemStatus?.status === 'maintenance' ? 'warning' : 'error'})`}
          />
          <div>
            <p className={`text-sm font-medium ${getStatusColor(systemStatus?.status)}`}>
              {getStatusText(systemStatus?.status)}
            </p>
            <p className="text-xs text-muted-foreground">
              Disponibilidad: {systemStatus?.uptime}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            Última actualización
          </p>
          <p className="text-xs font-mono text-muted-foreground">
            {systemStatus?.lastUpdate?.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;