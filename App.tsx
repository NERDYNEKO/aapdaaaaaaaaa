
import React, { useState, useCallback } from 'react';
import { Page, Alert } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SurvivalGuide from './components/SurvivalGuide';
import Alerts from './components/Alerts';
import Shelters from './components/Shelters';
import VolunteerPortal from './components/VolunteerPortal';
import EmergencyContacts from './components/EmergencyContacts';
import Map from './components/Map';
import ReportIncident from './components/ReportIncident';
import Profile from './components/Profile';
import Chatbot from './components/Chatbot';

// FIX: Populating App.tsx to resolve module loading errors and application structure.
const initialAlerts: Alert[] = [
  {
    id: 1,
    type: 'Flood Warning',
    area: 'Yamuna River, Delhi',
    severity: 'High',
    message: 'Water levels are expected to rise above the danger mark within the next 24 hours. Evacuate low-lying areas immediately.',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'Heatwave Advisory',
    area: 'Rajasthan',
    severity: 'Medium',
    message: 'Extreme heat expected for the next 48 hours. Stay indoors, stay hydrated, and avoid strenuous activity.',
    time: '8 hours ago',
  },
  {
    id: 3,
    type: 'Landslide Watch',
    area: 'Uttarakhand',
    severity: 'Low',
    message: 'Possibility of landslides due to continuous rainfall. Be cautious while traveling in hilly regions.',
    time: '1 day ago',
  },
];


function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  }, []);
  
  const handleAddAlert = (newAlertData: Omit<Alert, 'id' | 'time'>) => {
    const newAlert: Alert = {
      ...newAlertData,
      id: Date.now(),
      time: 'Just now',
    };
    setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
    setCurrentPage('alerts'); // Navigate to alerts page after reporting
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard navigate={navigate} />;
      case 'guide':
        return <SurvivalGuide />;
      case 'alerts':
        return <Alerts alerts={alerts} />;
      case 'shelters':
        return <Shelters />;
      case 'volunteer':
        return <VolunteerPortal />;
      case 'contacts':
        return <EmergencyContacts />;
      case 'map':
        return <Map />;
      case 'report':
        return <ReportIncident onAddAlert={handleAddAlert} />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard navigate={navigate} />;
    }
  };

  return (
    <div className="bg-brand-gray-900 text-brand-gray-100 min-h-screen font-sans">
      <Header onMenuClick={() => setSidebarOpen(true)} navigate={navigate} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} navigate={navigate} />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {renderPage()}
      </main>
      <div className="fixed bottom-4 right-4 z-30 h-[500px] w-[350px] hidden lg:block">
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
