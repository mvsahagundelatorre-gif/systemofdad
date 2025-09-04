import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityNotice = ({ className = '' }) => {
  const securityFeatures = [
    {
      icon: 'Shield',
      text: 'Conexión segura SSL/TLS'
    },
    {
      icon: 'Lock',
      text: 'Autenticación de dos factores'
    },
    {
      icon: 'Eye',
      text: 'Monitoreo de sesiones'
    },
    {
      icon: 'Clock',
      text: 'Cierre automático de sesión'
    }
  ];

  return (
    <div className={`bg-primary/5 border border-primary/20 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3 mb-3">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="ShieldCheck" size={16} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Seguridad Empresarial
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Su información está protegida con los más altos estándares de seguridad corporativa.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Icon 
              name={feature?.icon} 
              size={12} 
              color="var(--color-primary)" 
            />
            <span className="text-xs text-muted-foreground">
              {feature?.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityNotice;