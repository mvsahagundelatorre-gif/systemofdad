import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityMetricsCards = ({ metrics, loading = false }) => {
  const cards = [
    {
      title: 'Informes Totales',
      value: metrics?.totalReports || 0,
      icon: 'FileText',
      color: 'primary',
      description: 'Informes enviados'
    },
    {
      title: 'Pendientes',
      value: metrics?.pendingReports || 0,
      icon: 'Clock',
      color: 'warning',
      description: 'En revisión'
    },
    {
      title: 'Completados',
      value: metrics?.completedReports || 0,
      icon: 'CheckCircle',
      color: 'success',
      description: 'Finalizados'
    },
    {
      title: 'Este Mes',
      value: metrics?.thisMonth || 0,
      icon: 'Calendar',
      color: 'accent',
      description: 'Actividad reciente'
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary/10 text-primary';
      case 'warning':
        return 'bg-warning/10 text-warning';
      case 'success':
        return 'bg-success/10 text-success';
      case 'accent':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)]?.map((_, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-6 elevation-card">
            <div className="animate-pulse-gentle">
              <div className="w-12 h-12 bg-muted rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
              <div className="h-8 bg-muted rounded mb-2 w-1/2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards?.map((card, index) => (
        <div key={index} className="bg-card rounded-lg border border-border p-6 elevation-card hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(card?.color)}`}>
              <Icon name={card?.icon} size={24} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{card?.value}</div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{card?.title}</h3>
            <p className="text-xs text-muted-foreground">{card?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityMetricsCards;