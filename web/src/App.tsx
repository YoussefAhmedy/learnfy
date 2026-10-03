import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AiAssistantModal } from './components/AiAssistantModal';
import { LandingView } from './views/LandingView';
import { CatalogView } from './views/CatalogView';
import { CourseDetailView } from './views/CourseDetailView';
import { CoursePlayerView } from './views/CoursePlayerView';
import { LibraryView } from './views/LibraryView';
import { CartView } from './views/CartView';
import { DashboardView } from './views/DashboardView';
import { AdminCmsView } from './views/AdminCmsView';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-1');

  const handleNavigate = (view: string, courseId?: string) => {
    if (courseId) {
      setSelectedCourseId(courseId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-gray-900 pb-16 md:pb-0">
      
      {/* Sticky Universal Header */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main Routed View */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView onNavigate={handleNavigate} />
        )}
        {currentView === 'catalog' && (
          <CatalogView onNavigate={handleNavigate} />
        )}
        {currentView === 'course-detail' && (
          <CourseDetailView courseId={selectedCourseId} onNavigate={handleNavigate} />
        )}
        {currentView === 'player' && (
          <CoursePlayerView courseId={selectedCourseId} onNavigate={handleNavigate} />
        )}
        {currentView === 'library' && (
          <LibraryView onNavigate={handleNavigate} />
        )}
        {currentView === 'cart' || currentView === 'checkout' ? (
          <CartView onNavigate={handleNavigate} />
        ) : null}
        {currentView === 'dashboard' && (
          <DashboardView onNavigate={handleNavigate} />
        )}
        {currentView === 'admin' && (
          <AdminCmsView />
        )}
      </main>

      {/* AI Assistant Modal */}
      <AiAssistantModal onNavigateCourse={(cId) => handleNavigate('course-detail', cId)} />

      {/* Mobile Sticky Native Bottom Navigation */}
      <MobileBottomNav currentView={currentView} onNavigate={handleNavigate} />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
