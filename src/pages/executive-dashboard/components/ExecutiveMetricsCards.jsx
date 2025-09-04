import React from 'react';
import Icon from '../../../components/AppIcon';

const ExecutiveMetricsCards = ({ metrics, loading = false }) => {
  const metricCards = [
    {
      title: 'Informes Totales',
      value: metrics?.totalReports || 0,
      icon: 'FileText',
      color: 'primary',
      description: 'Todos los departamentos'
    },
    {
      title: 'Pendientes',
      value: metrics?.pendingReports || 0,
      icon: 'Clock',
      color: 'warning',
      description: 'Requieren revisión'
    },
    {
      title: 'Completados',
      value: metrics?.completedReports || 0,
      icon: 'CheckCircle',
      color: 'success',
      description: 'Este mes'
    },
    {
      title: 'Tasa de Finalización',
      value: `${metrics?.completionRate || 0}%`,
      icon: 'TrendingUp',
      color: 'accent',
      description: 'Promedio mensual'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)]?.map((_, i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-6">
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-muted rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricCards?.map((card, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-6 elevation-card">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              card?.color === 'primary' ? 'bg-primary/10' :
              card?.color === 'warning' ? 'bg-warning/10' :
              card?.color === 'success'? 'bg-success/10' : 'bg-accent/10'
            }`}>
              <Icon 
                name={card?.icon} 
                size={24} 
                color={`var(--color-${card?.color})`} 
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{card?.title}</p>
            <p className={`text-2xl font-semibold ${
              card?.color === 'primary' ? 'text-primary' :
              card?.color === 'warning' ? 'text-warning' :
              card?.color === 'success'? 'text-success' : 'text-accent'
            }`}>
              {card?.value}
            </p>
            <p className="text-xs text-muted-foreground">{card?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExecutiveMetricsCards;