import React from 'react';

const colorThemes = {
  indigo: {
    bg: 'bg-indigo-50/70',
    border: 'border-indigo-100',
    iconBg: 'bg-indigo-600 text-white shadow-indigo-500/20',
    text: 'text-indigo-600',
  },
  emerald: {
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-600 text-white shadow-emerald-500/20',
    text: 'text-emerald-600',
  },
  amber: {
    bg: 'bg-amber-50/70',
    border: 'border-amber-100',
    iconBg: 'bg-amber-500 text-white shadow-amber-500/20',
    text: 'text-amber-600',
  },
  purple: {
    bg: 'bg-purple-50/70',
    border: 'border-purple-100',
    iconBg: 'bg-purple-600 text-white shadow-purple-500/20',
    text: 'text-purple-600',
  },
  blue: {
    bg: 'bg-blue-50/70',
    border: 'border-blue-100',
    iconBg: 'bg-blue-600 text-white shadow-blue-500/20',
    text: 'text-blue-600',
  },
};

const MetricCard = ({
  label,
  value,
  icon: Icon,
  color = 'indigo',
  subtitle,
  trend,
}) => {
  const theme = colorThemes[color] || colorThemes.indigo;

  return (
    <div
      className={`rounded-2xl bg-white p-5 border ${theme.border} shadow-sm hover:shadow-md transition-all relative overflow-hidden`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            {label}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              {trend && (
                <span className="font-semibold text-emerald-600">{trend}</span>
              )}
              <span>{subtitle}</span>
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${theme.iconBg}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      <div
        className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-10 pointer-events-none ${theme.iconBg}`}
      />
    </div>
  );
};

export default MetricCard;
