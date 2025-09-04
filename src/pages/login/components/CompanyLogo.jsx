import React from 'react';
import Icon from '../../../components/AppIcon';

const CompanyLogo = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Logo Icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg flex items-center justify-center">
        <Icon name="Building2" size={32} color="white" />
      </div>
      
      {/* Company Name */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Portal Empresarial
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sistema de Gestión Corporativa
        </p>
      </div>
    </div>
  );
};

export default CompanyLogo;