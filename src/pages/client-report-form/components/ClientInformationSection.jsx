import React from 'react';
import Input from '../../../components/ui/Input';

const ClientInformationSection = ({ 
  clientName, 
  onClientNameChange, 
  clientPartNumber, 
  onClientPartNumberChange, 
  providerPartNumber, 
  onProviderPartNumberChange, 
  errors 
}) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Información del Cliente</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          label="Nombre del Cliente"
          type="text"
          placeholder="Ingrese el nombre del cliente"
          value={clientName}
          onChange={(e) => onClientNameChange(e?.target?.value)}
          error={errors?.clientName}
          required
          className="w-full"
        />
        
        <Input
          label="Número de Parte del Cliente"
          type="text"
          placeholder="Ej: CLI-2025-001"
          value={clientPartNumber}
          onChange={(e) => onClientPartNumberChange(e?.target?.value)}
          error={errors?.clientPartNumber}
          required
          className="w-full"
        />
        
        <Input
          label="Número de Parte del Proveedor"
          type="text"
          placeholder="Ej: PRV-2025-001"
          value={providerPartNumber}
          onChange={(e) => onProviderPartNumberChange(e?.target?.value)}
          error={errors?.providerPartNumber}
          required
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ClientInformationSection;