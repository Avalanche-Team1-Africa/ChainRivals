import React from 'react';

function BadgeCard({ badge, className = "" }) {
  // Map badge type to color scheme
  const getBadgeColors = (type) => {
    switch(type) {
      case 'gas_optimizer':
        return {
          bg: 'bg-purple-900/50',
          border: 'border-purple-500',
          text: 'text-purple-400'
        };
      case 'security_expert':
        return {
          bg: 'bg-blue-900/50',
          border: 'border-blue-500',
          text: 'text-blue-400'
        };
      case 'vulnerability_hunter':
        return {
          bg: 'bg-red-900/50',
          border: 'border-red-500',
          text: 'text-red-400'
        };
      case 'top_contributor':
        return {
          bg: 'bg-yellow-900/50',
          border: 'border-yellow-600',
          text: 'text-yellow-400'
        };
      case 'challenge_master':
        return {
          bg: 'bg-green-900/50',
          border: 'border-green-500',
          text: 'text-green-400'
        };
      case 'avalanche_specialist':
        return {
          bg: 'bg-red-900/50',
          border: 'border-red-600',
          text: 'text-red-400'
        };
      default:
        return {
          bg: 'bg-gray-700/50',
          border: 'border-gray-600',
          text: 'text-gray-400'
        };
    }
  };

  // Map badge type to icon
  const getBadgeIcon = (type) => {
    switch(type) {
      case 'gas_optimizer':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'security_expert':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'vulnerability_hunter':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'top_contributor':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'challenge_master':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'avalanche_specialist':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
    }
  };

  // Get badge display name
  const getBadgeDisplayName = (type) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const colors = getBadgeColors(badge.badge_type);
  
  return (
    <div className={`text-center ${className}`}>
      <div className={`relative w-24 h-24 ${colors.bg} border-2 ${colors.border} rounded-lg flex items-center justify-center mx-auto mb-2`}>
        <div className={colors.text}>
          {getBadgeIcon(badge.badge_type)}
        </div>
        {badge.is_onchain && (
          <div className="absolute -top-2 -right-2 bg-green-600 rounded-full p-1 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        )}
      </div>
      <div className="font-medium">{getBadgeDisplayName(badge.badge_type)}</div>
      <div className="text-sm text-gray-400">Level {badge.level}</div>
    </div>
  );
}

export default BadgeCard;
