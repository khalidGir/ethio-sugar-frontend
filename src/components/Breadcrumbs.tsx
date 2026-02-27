import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav 
      className="flex items-center gap-1 text-sm text-gray-500 mb-4" 
      aria-label="Breadcrumb"
    >
      <Link 
        to="/dashboard" 
        className="hover:text-forest-600 transition-colors p-1"
        aria-label="Go to dashboard"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
          {item.href && index < items.length - 1 ? (
            <Link 
              to={item.href} 
              className="hover:text-forest-600 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className="text-gray-900 font-semibold"
              aria-current="page"
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
