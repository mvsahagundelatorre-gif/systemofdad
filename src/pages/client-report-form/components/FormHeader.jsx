import React from 'react';
import Icon from '../../../components/AppIcon';

const FormHeader = ({ captureDate, assignmentNumber, coordinatorName }) => {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 border border-border mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Formulario de Informe de Cliente</h1>
            <p className="text-muted-foreground">Complete todos los campos obligatorios para generar el informe</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Fecha de Captura</label>
          <div className="flex items-center space-x-2 p-2 bg-card rounded-md border border-border">
            <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm font-mono text-foreground">{captureDate}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Número de Asignación</label>
          <div className="flex items-center space-x-2 p-2 bg-card rounded-md border border-border">
            <Icon name="Hash" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm font-mono text-foreground">{assignmentNumber}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Coordinador</label>
          <div className="flex items-center space-x-2 p-2 bg-card rounded-md border border-border">
            <Icon name="User" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm text-foreground">{coordinatorName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;