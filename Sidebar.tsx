
import React from 'react';
// FIX: Populating file to resolve parsing errors. Assuming this is a duplicate of components/Sidebar.tsx and adjusting paths accordingly.
import { Page } from './types';
import { HomeIcon } from './components/icons/HomeIcon';
import { BookOpenIcon } from './components/icons/BookOpenIcon';
import { UsersIcon } from './components/icons/UsersIcon';
import { MapPinIcon } from './components/icons/MapPinIcon';
import { AlertIcon } from './components/icons/AlertIcon';
import { CloseIcon } from './components/icons/CloseIcon';
import { CameraIcon } from './components/icons/CameraIcon';
import { UserProfileIcon } from './components/icons/UserProfileIcon';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigate: (page: Page) => void;
}

const navItems = [
  { page: 'dashboard' as Page, label: 'Home', icon: <HomeIcon /> },
  { page: 'alerts' as Page, label: 'Real-time Alerts', icon: <AlertIcon /> },
  { page: 'report' as Page, label: 'Report Incident', icon: <CameraIcon /> },
  { page: 'guide' as Page, label: 'Survival Guides', icon: <BookOpenIcon /> },
  { page: 'shelters' as Page, label: 'Find Shelters', icon: <MapPinIcon /> },
  { page: 'volunteer' as Page, label: 'Volunteer Portal', icon: <UsersIcon /> },
  { page: 'map' as Page, label: 'Maps Help', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 0l6-3m0 0l-6-4m6 4l6 3" /></svg> },
  { page: 'profile' as Page, label: 'Profile', icon: <UserProfileIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, navigate }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-brand-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-brand-gray-700">
          <h2 className="text-xl font-bold text-brand-blue">Menu</h2>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-brand-gray-700 text-brand-gray-300">
            <CloseIcon />
          </button>
        </div>
        <nav className="p-4">
          <ul>
            {navItems.map(item => (
              <li key={item.page}>
                <button
                  onClick={() => navigate(item.page)}
                  className="w-full flex items-center gap-4 p-3 rounded-lg text-brand-gray-300 hover:bg-brand-blue/20 hover:text-brand-blue transition-colors duration-200"
                >
                  {item.icon}
                  <span className="font-semibold">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
