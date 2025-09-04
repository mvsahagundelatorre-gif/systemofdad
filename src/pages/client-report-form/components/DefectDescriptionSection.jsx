import React from 'react';
import Icon from '../../../components/AppIcon';

const DefectDescriptionSection = ({ value, onChange, error }) => {
  const maxLength = 2000;
  const remainingChars = maxLength - (value?.length || 0);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Descripción del Defecto</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Descripción Detallada <span className="text-error">*</span>
        </label>
        <div className="relative">
          <textarea
            className="w-full min-h-[120px] px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-vertical"
            placeholder="Describa detalladamente el defecto encontrado, incluyendo circunstancias, impacto y cualquier información relevante..."
            value={value || ''}
            onChange={(e) => onChange(e?.target?.value)}
            maxLength={maxLength}
            required
            rows={6}
          />
          <div className="absolute bottom-2 right-2 flex items-center space-x-2">
            <Icon name="FileText" size={14} color="var(--color-muted-foreground)" />
            <span className={`text-xs ${remainingChars < 100 ? 'text-warning' : 'text-muted-foreground'}`}>
              {remainingChars} caracteres restantes
            </span>
          </div>
        </div>
        {error && (
          <p className="text-xs text-error flex items-center space-x-1">
            <Icon name="AlertCircle" size={12} />
            <span>{error}</span>
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Proporcione una descripción completa y detallada para facilitar el análisis y resolución.
        </p>
      </div>
    </div>
  );
};

export default DefectDescriptionSection;