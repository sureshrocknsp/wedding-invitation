import React, { useState, useCallback, useEffect } from 'react';
import { weddingData } from './data/weddingData';
import { WeddingEntrance } from './components/cinematic/WeddingEntrance';
import { MainInvitation } from './components/invitation/MainInvitation';
import { SacredKalyanamPage } from './components/pages/SacredKalyanamPage';
import { PetalCanvas } from './components/ui/PetalCanvas';
import { AudioToggle } from './components/ui/AudioToggle';
import { useAudioEngine } from './hooks/useAudioEngine';
import './styles/wedding.css';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'kalyanam'>(() => {
    return window.location.hash.includes('kalyanam') ? 'kalyanam' : 'home';
  });
  const [isEntranceDismissed, setIsEntranceDismissed] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState<{ x: number; y: number; count: number } | null>(null);

  const { isPlaying, playTempleBell, startMusic, toggleMusic } = useAudioEngine();

  // Handle browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.includes('kalyanam')) {
        setCurrentPage('kalyanam');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = useCallback((page: 'home' | 'kalyanam') => {
    setCurrentPage(page);
    if (page === 'kalyanam') {
      window.location.hash = '/kalyanam';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '/';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handlePetalBurst = useCallback((x: number, y: number, count: number) => {
    setBurstTrigger({ x, y, count });
  }, []);

  const handleAudioStart = useCallback(() => {
    startMusic();
    playTempleBell();
  }, [startMusic, playTempleBell]);

  const handleReplayEntry = useCallback(() => {
    navigateTo('home');
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsEntranceDismissed(false);
  }, [navigateTo]);

  return (
    <div className="wedding-app-root">
      {/* Canvas Layer for Floating Petals */}
      <PetalCanvas burstTrigger={burstTrigger} />

      {/* Floating Audio Toggle */}
      <AudioToggle isPlaying={isPlaying} onToggle={toggleMusic} />

      {/* Opening Cinematic Stage */}
      {!isEntranceDismissed && (
        <WeddingEntrance
          data={weddingData}
          onAudioStart={handleAudioStart}
          onPetalBurst={handlePetalBurst}
          onComplete={() => setIsEntranceDismissed(true)}
        />
      )}

      {/* Main Wedding Invitation or Dedicated Sacred Kalyanam Page */}
      {currentPage === 'kalyanam' ? (
        <SacredKalyanamPage
          data={weddingData}
          onBack={() => navigateTo('home')}
          onPetalBurst={handlePetalBurst}
        />
      ) : (
        <MainInvitation
          data={weddingData}
          onReplayEntry={handleReplayEntry}
          onPetalBurst={handlePetalBurst}
          onNavigateToKalyanam={() => navigateTo('kalyanam')}
        />
      )}
    </div>
  );
};

export default App;
