import React, { useState, useEffect } from 'react';
import { WeddingData } from '../../data/weddingData';
import { FloralCornerSVG } from '../ui/FloralCornerSVG';
import { ShareModal } from '../ui/ShareModal';

interface MainInvitationProps {
  data: WeddingData;
  onReplayEntry: () => void;
  onNavigateToKalyanam: () => void;
}

export const MainInvitation: React.FC<MainInvitationProps> = ({
  data,
  onReplayEntry,
  onNavigateToKalyanam
}) => {
  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEventStarted, setIsEventStarted] = useState(false);


  // Lightbox state
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Share & QR Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // RSVP state
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpAttendance, setRsvpAttendance] = useState<'attending' | 'declined'>('attending');
  const [rsvpCount, setRsvpCount] = useState<string>(
    data.rsvp.guestCountOptions?.[1] || '2 Persons'
  );
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpNameError, setRsvpNameError] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [blessings, setBlessings] = useState(data.rsvp.initialBlessings);

  // Off-canvas quick navigation drawer state
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  // Share feedback toast state
  const [shareToast, setShareToast] = useState<string | null>(null);

  // RSVP submission loading & error state
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpErrorMsg, setRsvpErrorMsg] = useState<string | null>(null);

  // Personalized guest greeting from URL (?guest= or ?to=)
  const [guestParam, setGuestParam] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const g = params.get('guest') || params.get('to') || params.get('name');
    if (g) setGuestParam(g);
  }, []);

  // Dynamically synchronize page title and social meta tags from centralized configuration
  useEffect(() => {
    if (data.socialSharing?.pageTitle) {
      document.title = data.socialSharing.pageTitle;
    }
    if (data.socialSharing?.metaDescription) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', data.socialSharing.metaDescription);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', data.socialSharing.ogDescription || data.socialSharing.metaDescription);
    }
    if (data.socialSharing?.ogTitle) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', data.socialSharing.ogTitle);
    }
  }, [data.socialSharing]);

  // Robust Countdown logic tied directly to centralized weddingDate with safeguards
  useEffect(() => {
    if (!data.weddingDate) return;
    const target = new Date(data.weddingDate).getTime();
    if (isNaN(target)) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsEventStarted(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: Math.max(0, days),
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds)
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [data.weddingDate]);

  // Load saved blessings
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wedding_blessings_react_v1');
      if (saved) {
        setBlessings(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Handle RSVP Submit with Loading Feedback
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) {
      setRsvpNameError(true);
      return;
    }
    setRsvpNameError(false);
    setRsvpErrorMsg(null);
    setIsSubmittingRsvp(true);

    const noteText = rsvpMessage.trim() || `Joyfully celebrating with ${data.couple.groom.name} & ${data.couple.bride.name}! (${rsvpCount} attending)`;

    const newBlessing = {
      name: rsvpName.trim(),
      time: 'Just now',
      text: noteText
    };

    // Optional remote API/webhook dispatch (e.g. Google Sheets, Formspree, or custom webhook)
    const remoteEndpoint = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_RSVP_ENDPOINT) || data.rsvp.submissionEndpoint;
    if (remoteEndpoint) {
      try {
        fetch(remoteEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: rsvpName.trim(),
            attendance: rsvpAttendance,
            guestCount: rsvpAttendance === 'attending' ? rsvpCount : '0',
            message: rsvpMessage.trim(),
            submittedAt: new Date().toISOString()
          })
        }).catch((err) => {
          console.warn('Optional remote RSVP webhook skipped:', err);
        });
      } catch {}
    }

    setTimeout(() => {
      try {
        const updated = [newBlessing, ...blessings];
        setBlessings(updated);
        localStorage.setItem('wedding_blessings_react_v1', JSON.stringify(updated));
        setIsSubmittingRsvp(false);
        setRsvpSubmitted(true);
      } catch {
        setIsSubmittingRsvp(false);
        setRsvpErrorMsg('Unable to save RSVP right now. Please try again.');
      }
    }, 450);
  };

  const handleResetRsvp = () => {
    setRsvpName('');
    setRsvpMessage('');
    setRsvpAttendance('attending');
    setRsvpCount(data.rsvp.guestCountOptions?.[1] || '2 Persons');
    setRsvpNameError(false);
    setRsvpErrorMsg(null);
    setIsSubmittingRsvp(false);
    setRsvpSubmitted(false);
  };

  // Tasteful Share Functionality (Opens unified WhatsApp, Copy Link & QR Code Modal)
  const handleShareInvitation = () => {
    setIsShareModalOpen(true);
  };

  // Lightbox navigation
  const openLightbox = (index: number) => setActiveLightboxIndex(index);
  const closeLightbox = () => setActiveLightboxIndex(null);
  const nextLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % data.gallery.length);
    }
  };
  const prevLightbox = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex(
        (activeLightboxIndex - 1 + data.gallery.length) % data.gallery.length
      );
    }
  };

  // Lightbox keyboard controls (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (activeLightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeLightboxIndex, data.gallery.length]);

  // Drawer keyboard controls (Escape closes drawer)
  useEffect(() => {
    if (!isNavDrawerOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsNavDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isNavDrawerOpen]);

  // Add to Calendar using centralized date, time and venue data
  const handleAddToCalendar = () => {
    const title = `Wedding of ${data.couple.bride.fullName} & ${data.couple.groom.fullName}`;
    const desc = `${data.invitationNoteEnglish}\n\nVenue: ${data.venue.name}, ${data.venue.address}, ${data.venue.city}, ${data.venue.state}`;
    const loc = `${data.venue.name}, ${data.venue.address}, ${data.venue.city}, ${data.venue.state} ${data.venue.pincode}`;
    
    // Convert configured weddingDate (ISO format) to UTC calendar dates
    let start = '20261101T061700Z'; // 11:47 AM IST = 06:17 UTC
    let end = '20261101T113000Z';   // 05:00 PM IST = 11:30 UTC
    try {
      const wDate = new Date(data.weddingDate);
      if (!isNaN(wDate.getTime())) {
        const formatCalTime = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        start = formatCalTime(wDate);
        const endDate = new Date(wDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours window
        end = formatCalTime(endDate);
      }
    } catch {}

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${start}/${end}&details=${encodeURIComponent(desc)}&location=${encodeURIComponent(
      loc
    )}`;
    window.open(url, '_blank');
  };

  const heroBg = data.assets?.mandapamStage || '/assets/images/mandapam_stage.jpg';

  return (
    <div className="main-invitation-wrapper" id="mainInvitationContent">
      {/* 1. HERO INVITATION SECTION */}
      <section
        id="heroInvitation"
        className="hero-invitation-section"
        style={{ backgroundImage: `url('${heroBg}')` }}
      >
        <div className="hero-backdrop-overlay"></div>

        <div className="hero-content-card">
          {/* Delicate Static Floral Corner Ornaments */}
          <div className="floral-corner top-left" aria-hidden="true">
            <FloralCornerSVG size={60} />
          </div>
          <div className="floral-corner top-right" aria-hidden="true">
            <FloralCornerSVG size={60} />
          </div>
          <div className="floral-corner bottom-left" aria-hidden="true">
            <FloralCornerSVG size={60} />
          </div>
          <div className="floral-corner bottom-right" aria-hidden="true">
            <FloralCornerSVG size={60} />
          </div>

          {/* Traditional Telugu & Sanskrit Sacred Invocation */}
          <div className="hero-divine-symbol">శ్రీరస్తు • శుభమస్తు • కళ్యాణమస్తు</div>
          <p className="hero-invocation">॥ వివాహ మహోత్సవ ఆహ్వాన శుభ పత్రిక ॥</p>

          {/* 1. TOGETHER WITH THEIR FAMILIES */}
          <p className="hero-together-label">TOGETHER WITH THEIR FAMILIES</p>

          {guestParam && (
            <div className="guest-greeting-pill">
              ✨ Cordially Inviting: <strong>{guestParam}</strong> & Family ✨
            </div>
          )}

          {/* 2. BRIDE NAME & 3. AMPERSAND & 4. GROOM NAME */}
          <div className="hero-couple-showcase">
            <div className="couple-name-row bride-row">
              <span className="formal-prefix">{data.couple.bride.formalTitle || 'Chi.La.Sow.'}</span>
              <span className="couple-name-script gold-shimmer-text">{data.couple.bride.name}</span>
              {data.couple.bride.aliasName && (
                <span className="couple-alias-badge">({data.couple.bride.aliasName})</span>
              )}
              <span className="telugu-single-name">{data.couple.bride.teluguName}</span>
            </div>

            <div className="couple-ampersand-wrap">
              <span className="ampersand-flourish-line" aria-hidden="true"></span>
              <span className="couple-ampersand">&</span>
              <span className="ampersand-flourish-line" aria-hidden="true"></span>
            </div>

            <div className="couple-name-row groom-row">
              <span className="formal-prefix">{data.couple.groom.formalTitle || 'Chi.'}</span>
              <span className="couple-name-script gold-shimmer-text">{data.couple.groom.name}</span>
              {data.couple.groom.aliasName && (
                <span className="couple-alias-badge">({data.couple.groom.aliasName})</span>
              )}
              <span className="telugu-single-name">{data.couple.groom.teluguName}</span>
            </div>
          </div>

          <div className="hero-telugu-pair-badge">
            {data.couple.bride.teluguName} పరిణయం {data.couple.groom.teluguName}
          </div>

          {/* Thin Gold Decorative Divider */}
          <div className="card-thin-divider" aria-hidden="true">
            <span className="divider-line"></span>
            <span className="divider-lotus">🪷</span>
            <span className="divider-line"></span>
          </div>

          {/* 5. INVITATION MESSAGE */}
          <div className="hero-invitation-message-block">
            <p className="hero-invitation-intro">
              {data.invitationNoteEnglish}
            </p>
            <p className="hero-invitation-telugu">
              {data.invitationNoteTelugu}
            </p>
          </div>

          {/* 6. WEDDING DATE & 7. VENUE */}
          <div className="hero-event-highlight">
            <div className="highlight-item date-highlight">
              <div className="highlight-icon-box" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                </svg>
              </div>
              <div className="highlight-text-wrap">
                <span className="highlight-section-tag">Auspicious Wedding Date</span>
                <span className="highlight-main-title">{data.weddingDateFormatted}</span>
                <span className="highlight-sub">{data.weddingDateTelugu}</span>
                <span className="highlight-detail">Sumuhurtham: <strong>{data.muhurthamTime}</strong> ({data.astrology.lagnam})</span>
              </div>
            </div>

            <div className="highlight-item venue-highlight">
              <div className="highlight-icon-box" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <div className="highlight-text-wrap">
                <span className="highlight-section-tag">Kalyana Vedika</span>
                <span className="highlight-main-title">{data.venue.name}</span>
                <span className="highlight-sub">{data.venue.teluguName}</span>
                <span className="highlight-detail">{data.venue.address}, {data.venue.city}, {data.venue.district}</span>
              </div>
            </div>
          </div>

          <div className="hero-actions-group">
            <a href="#rsvpSection" className="primary-btn">
              <span>Send Blessings / RSVP</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
              </svg>
            </a>
            <button onClick={handleAddToCalendar} className="secondary-btn" type="button">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
              </svg>
              <span>Add to Calendar</span>
            </button>
            <button
              onClick={handleShareInvitation}
              className="ghost-map-btn hero-share-btn"
              type="button"
              aria-label="Share Wedding Invitation"
              title="Share Invitation"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
              </svg>
              <span>Share</span>
            </button>
            <a
              href={data.venue.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ghost-map-btn"
            >
              <span>📍 View Map</span>
            </a>
          </div>
        </div>
      </section>

      {/* 1.5 DIVINE MUHURTHAM BLESSING CARD (MOVED UP PER REQUEST) */}
      <section className="divine-blessing-section" id="divineBlessingSection">
        <div className="section-container">
          <div className="ceremony-hero-banner">
            <span className="section-tag">Divine Muhurtham Blessing</span>
            <h3 className="ceremony-hero-title gold-shimmer-text">
              "శ్లో॥ ఆదిత్యాది గ్రహాస్సర్వే స్వనక్షత్ర స్వరాశయః | కుర్వంతు మంగళం తాభ్యాం యయోరుద్వాహ పత్రికా ॥"
            </h3>
            <p className="ceremony-hero-desc">
              May the divine celestial deities bless {data.couple.groom.fullName} and {data.couple.bride.fullName}
              with lifelong health, prosperity, harmony, and eternal companionships.
            </p>
          </div>
        </div>
      </section>

      {/* 2. LIVE COUNTDOWN & ASTROLOGY SECTION */}
      <section className="countdown-section" id="countdownSection">
        <div className="section-container">
          <div className="countdown-wrapper">
            <span className="muhurtham-badge">🪔 Auspicious Muhurtham Countdown • సుముహూర్తం 🪔</span>

            {!isEventStarted ? (
              <div className="timer-grid">
                <div className="timer-unit">
                  <div className="timer-digit">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="timer-label">DAYS</div>
                  <div className="timer-sublabel">రోజులు</div>
                </div>
                <div className="timer-sep" aria-hidden="true">|</div>
                <div className="timer-unit">
                  <div className="timer-digit">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="timer-label">HOURS</div>
                  <div className="timer-sublabel">గంటలు</div>
                </div>
                <div className="timer-sep" aria-hidden="true">|</div>
                <div className="timer-unit">
                  <div className="timer-digit">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="timer-label">MINUTES</div>
                  <div className="timer-sublabel">నిమిషాలు</div>
                </div>
                <div className="timer-sep" aria-hidden="true">|</div>
                <div className="timer-unit">
                  <div className="timer-digit">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="timer-label">SECONDS</div>
                  <div className="timer-sublabel">సెకన్లు</div>
                </div>
              </div>
            ) : (
              <div className="countdown-zero-msg">
                ✨ Today is the Auspicious Wedding Day! ❤️ కళ్యాణ సంబరం! ✨
              </div>
            )}

            <div className="astrology-box-enhanced">
              <div className="panchangam-samvatsara-tag">
                {data.astrology.samvatsaram}
              </div>
              <p className="astrology-info-text">
                సుముహూర్తం: <strong>{data.astrology.teluguLagnam}</strong> | నక్షత్రం: <strong>{data.astrology.teluguNakshatram}</strong> | తిథి: <strong>{data.astrology.teluguTithi}</strong>
              </p>
              <div className="astrology-english-sub">
                Lagnam: <strong>{data.astrology.lagnam}</strong> • Nakshatram: <strong>{data.astrology.nakshatram}</strong> • Time: <strong>{data.muhurthamTime}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 3. COUPLE & LINEAGE */}
      <section className="couple-section" id="coupleSection">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">The Blessed Souls</span>
            <h2 className="section-title">The Bride & The Groom</h2>
            <div className="section-divider">
              <span className="line"></span>
              <span className="flower-icon">🪷</span>
              <span className="line"></span>
            </div>
          </div>

          {/* Centerpiece Blessed Couple Feature Showcase */}
          <div className="couple-spotlight-card">
            <div className="spotlight-frame-wrapper">
              <div className="spotlight-photo-frame">
                <img
                  src={data.assets?.couplePortrait || "/assets/images/couple_portrait.jpg"}
                  alt={`${data.couple.bride.name} & ${data.couple.groom.name} - The Blessed Couple`}
                  className="spotlight-couple-img"
                  loading="lazy"
                  onError={(e) => {
                    const current = e.currentTarget;
                    if (!current.dataset.fallbackTried) {
                      current.dataset.fallbackTried = 'true';
                      current.src = '/assets/images/mandapam_stage.jpg';
                    }
                  }}
                />
                <div className="spotlight-badge-overlay">
                  <span className="spotlight-hashtag">{data.couple.hashtag || "#ShivaWedsLahari"}</span>
                </div>
              </div>
            </div>
            <div className="spotlight-info">
              <span className="card-badge-gold">దివ్య దంపతులు • The Blessed Couple</span>
              <h3 className="spotlight-title gold-shimmer-text">
                {data.couple.bride.name} & {data.couple.groom.name}
              </h3>
              <div className="spotlight-telugu-name">
                {data.couple.bride.teluguName} పరిణయం {data.couple.groom.teluguName}
              </div>
              <p className="spotlight-desc">
                "Two souls united by destiny, blessed by sacred Telugu traditions, and walking hand-in-hand towards an eternal journey of love, harmony, and togetherness."
              </p>
              <div className="spotlight-meta-tags">
                <span className="spotlight-tag">🪔 Sumuhurtham: {data.muhurthamTime} ({data.astrology.lagnam})</span>
                <span className="spotlight-tag">🏛️ {data.venue.name}, {data.venue.city}</span>
              </div>
            </div>
          </div>

          <div className="couple-grid">
            {/* Bride Card */}
            <div className="couple-card">
              <div className="couple-avatar-frame">
                <img
                  src={data.couple.bride.photo}
                  alt={`${data.couple.bride.name} - Bride`}
                  className="couple-avatar-img bride-avatar-img"
                  onError={(e) => {
                    const current = e.currentTarget;
                    if (!current.dataset.fallbackTried) {
                      current.dataset.fallbackTried = 'true';
                      current.src = data.assets?.bridePortrait || '/assets/images/bride_portrait.jpg';
                    }
                  }}
                />
              </div>
              <div className="couple-role-badge">{data.couple.bride.role}</div>
              <h3 className="couple-person-name gold-text">{data.couple.bride.fullName}</h3>
              <div className="couple-telugu-name-tag">{data.couple.bride.teluguName}</div>
              <p className="couple-lineage">
                Younger Daughter of:
                <br />
                <strong>{data.couple.bride.parents}</strong>
                <span className="telugu-lineage-sub">
                  ({data.couple.bride.teluguParents} గార్ల కనిష్ట పుత్రిక)
                </span>
              </p>
              <p className="couple-quote">"{data.couple.bride.quote}"</p>
            </div>

            {/* Groom Card */}
            <div className="couple-card">
              <div className="couple-avatar-frame">
                <img
                  src={data.couple.groom.photo}
                  alt={`${data.couple.groom.name} - Groom`}
                  className="couple-avatar-img groom-avatar-img"
                  onError={(e) => {
                    const current = e.currentTarget;
                    if (!current.dataset.fallbackTried) {
                      current.dataset.fallbackTried = 'true';
                      current.src = data.assets?.groomPortrait || '/assets/images/groom_portrait.jpg';
                    }
                  }}
                />
              </div>
              <div className="couple-role-badge">{data.couple.groom.role}</div>
              <h3 className="couple-person-name gold-text">{data.couple.groom.fullName}</h3>
              <div className="couple-telugu-name-tag">{data.couple.groom.teluguName}</div>
              <p className="couple-lineage">
                Only Son of:
                <br />
                <strong>{data.couple.groom.parents}</strong>
                <span className="telugu-lineage-sub">
                  ({data.couple.groom.teluguParents} గార్ల ఏకైక పుత్రుడు)
                </span>
                <span className="residence-location-pill">
                  📍 {data.couple.groom.residence} ({data.couple.groom.teluguResidence})
                </span>
              </p>
              <p className="couple-quote">"{data.couple.groom.quote}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3.1 DEDICATED SEPARATE PAGE TEASER CARD */}
      <section className="kalyanam-teaser-section">
        <div className="section-container">
          <div className="kalyanam-teaser-card">
            <div className="teaser-badge">శ్రీరస్తు • శుభమస్తు • కళ్యాణమస్తు</div>
            <span className="section-tag">వివాహ విశిష్టత & సప్తపది</span>
            <h2 className="teaser-title gold-shimmer-text">
              The Sacred Essence of Telugu Kalyanam
            </h2>
            <div className="section-divider">
              <span className="line"></span>
              <span className="flower-icon">🔥</span>
              <span className="line"></span>
            </div>
            <p className="teaser-telugu-tag">సనాతన ధర్మం • ఏడడుగుల శాశ్వత బంధం • సర్వదేవతా దివ్య ఆశీర్వాదములు</p>
            <p className="teaser-desc">
              Explore the profound Vedic sanctity of South Indian marriage, the 4 sacred pillars of Dharma, the divine blessings of supreme deities, and the eternal 7 vows of Saptapadi (సప్తపది).
            </p>
            <div className="teaser-cta-wrap">
              <button
                onClick={onNavigateToKalyanam}
                className="primary-btn teaser-explore-btn"
                type="button"
              >
                <span>📖 View Dedicated Page: Sacred Essence & 7 Vows (వివాహ విశిష్టత) →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 FAMILY, INVITES BY & WELL WISHERS */}
      <section className="well-wishers-section" id="wellWishersSection">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Family & Lineage</span>
            <h2 className="section-title">Invited By & Near and Dear</h2>
            <div className="section-divider">
              <span className="line"></span>
              <span className="flower-icon">💐</span>
              <span className="line"></span>
            </div>
            <p className="section-subtitle">
              మీ ఆగమనాభిలాషులు మరియు బంధుమిత్రుల అభినందనలతో
            </p>
          </div>

          <div className="invites-and-wishers-grid">
            {/* Invites By Card */}
            <div className="invites-by-card">
              <div className="card-ornament-header">
                <span className="card-badge-gold">మీ ఆగమనాభిలాషులు</span>
                <h3 className="invites-title gold-shimmer-text">Invited by (Parents of Bride)</h3>
              </div>
              <div className="invites-parents-list">
                {data.invitesBy.parentsEnglish.map((parent, idx) => (
                  <div key={idx} className="parent-name-box">
                    <span className="diya-bullet">🪔</span>
                    <div>
                      <div className="parent-eng-name">{parent}</div>
                      <div className="parent-tel-name">{data.invitesBy.parentsTelugu[idx]}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="invites-note">
                "We cordially invite you and your family to grace the auspicious marriage ceremony of our younger daughter Lahari with Shiva Kumar and bless the newlyweds."
              </p>
            </div>

            {/* Well Wishers Card */}
            <div className="well-wishers-card">
              <div className="card-ornament-header">
                <span className="card-badge-gold">బంధుమిత్రుల అభినందనలతో</span>
                <h3 className="invites-title gold-shimmer-text">With Best Wishes From : Near and Dear</h3>
              </div>
              <div className="well-wishers-tag-grid">
                {data.bestWishesFrom.membersTelugu.map((member, idx) => (
                  <div key={idx} className="wisher-tag-pill">
                    <span className="wisher-sparkle">✨</span>
                    <span className="wisher-name-tel">{member}</span>
                    {data.bestWishesFrom.membersEnglish[idx] && (
                      <span className="wisher-name-eng">({data.bestWishesFrom.membersEnglish[idx]})</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="groom-family-salute">
                <span className="diya-bullet">🌺</span>
                <span>With blessings from Gadde Family (Raghavapur) & Devarakonda Family</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SACRED RITUALS */}
      <section className="rituals-section" id="ritualsSection">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Sacred Traditions</span>
            <h2 className="section-title">Holy Wedding Ceremonies</h2>
            <div className="section-divider">
              <span className="line"></span>
              <span className="flower-icon">🪔</span>
              <span className="line"></span>
            </div>
          </div>

          <div className="rituals-grid">
            {data.rituals.map((r) => (
              <div key={r.id} className="ritual-card">
                <div className="ritual-image-box">
                  <img
                    src={r.image}
                    alt={r.name}
                    onError={(e) => {
                      const current = e.currentTarget;
                      if (!current.dataset.fallbackTried) {
                        current.dataset.fallbackTried = 'true';
                        current.src = data.assets?.mandapamStage || '/assets/images/mandapam_stage.jpg';
                      }
                    }}
                  />
                  <span className="ritual-badge-time">{r.time}</span>
                </div>
                <div className="ritual-info">
                  <h3 className="ritual-name">{r.name}</h3>
                  <div className="ritual-subname">{r.sanskritName}</div>
                  <p className="ritual-description">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TIMELINE / ITINERARY */}
      <section className="timeline-section" id="itinerarySection">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Celebration Itinerary</span>
            <h2 className="section-title">Schedule of Auspicious Events</h2>
            <div className="section-divider">
              <span className="line"></span>
              <span className="flower-icon">✨</span>
              <span className="line"></span>
            </div>
          </div>

          <div className="timeline-container">
            {data.events.map((e, idx) => (
              <div
                key={e.id}
                className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'} ${
                  e.isPrimary ? 'highlight-muhurtham' : ''
                }`}
              >
                <div className="timeline-node-pin"></div>
                <div className={`timeline-box ${e.isPrimary ? 'muhurtham-timeline-box' : ''}`}>
                  {e.image && (
                    <div className="timeline-event-image-box">
                      <img
                        src={e.image}
                        alt={e.name}
                        className="timeline-event-img"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLElement;
                          if (target && target.parentElement) {
                            target.parentElement.style.display = 'none';
                          }
                        }}
                      />
                    </div>
                  )}
                  <span className="timeline-date-tag">{e.dayTag}</span>
                  <h3 className={`timeline-title ${e.isPrimary ? 'gold-shimmer-text' : ''}`}>
                    {e.name}
                  </h3>
                  {e.teluguName && (
                    <div className="timeline-telugu-title">{e.teluguName}</div>
                  )}
                  <div className="timeline-timing">
                    ⏰ {e.time} | {e.venue}
                  </div>
                  {e.address && (
                    <div className="timeline-venue-address" style={{ fontSize: '0.82rem', color: '#e8d5a5', marginTop: '0.25rem' }}>
                      📍 {e.address}
                    </div>
                  )}
                  {e.description && <p className="timeline-desc">{e.description}</p>}
                  {(e.mapUrl || data.venue.googleMapsUrl) && (
                    <div className="timeline-directions-row">
                      <a
                        href={e.mapUrl || data.venue.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="event-directions-link"
                        title={`View directions to ${e.venue}`}
                      >
                        <span>📍 View Directions</span>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VENUE & MAP */}
      <section className="venue-section" id="venueSection">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Grand Location</span>
            <h2 className="section-title">The Wedding Venue (కళ్యాణవేదిక)</h2>
            <div className="section-divider">
              <span className="line"></span>
              <span className="flower-icon">🏛️</span>
              <span className="line"></span>
            </div>
          </div>

          <div className="venue-card-wrapper">
            <div className="venue-details">
              <span className="section-tag">Kalyana Vedika</span>
              <h3 className="venue-name-title">{data.venue.name}</h3>
              {data.venue.teluguName && (
                <div className="venue-telugu-name-large">{data.venue.teluguName}</div>
              )}
              <p className="venue-address-text">
                <strong>{data.venue.address}</strong>
                <br />
                {data.venue.city}, {data.venue.district}, {data.venue.state} - {data.venue.pincode}
                {data.venue.landmark && (
                  <>
                    <br />
                    <span className="venue-landmark">Landmark: {data.venue.landmark}</span>
                  </>
                )}
              </p>

              {data.venue.amenities && data.venue.amenities.length > 0 && (
                <ul className="venue-amenities-list">
                  {data.venue.amenities.map((item, idx) => (
                    <li key={idx}>
                      <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {data.venue.googleMapsUrl && (
                <div className="venue-cta-row">
                  <a
                    href={data.venue.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="primary-btn"
                  >
                    <span>View Location / Directions</span>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </a>
                </div>
              )}
            </div>

            {data.venue.embedMapUrl && (
              <div className="venue-map-container">
                <iframe
                  src={data.venue.embedMapUrl}
                  loading="lazy"
                  title={`${data.venue.name} Location Map`}
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. GALLERY SECTION */}
      <section className="gallery-section" id="gallerySection">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Glimpses of Joy</span>
            <h2 className="section-title">Memories & Moments</h2>
            <div className="section-divider">
              <span className="line"></span>
              <span className="flower-icon">📸</span>
              <span className="line"></span>
            </div>
          </div>

          <div className="gallery-grid">
            {data.gallery && data.gallery.length > 0 ? (
              data.gallery
                .filter((g) => g && g.src)
                .map((g, idx) => (
                  <div
                    key={idx}
                    className="gallery-item"
                    onClick={() => openLightbox(idx)}
                    role="button"
                    tabIndex={0}
                  >
                    <img
                      src={g.src}
                      alt={g.title}
                      loading="lazy"
                      onError={(e) => {
                        const current = e.currentTarget;
                        if (!current.dataset.fallbackTried) {
                          current.dataset.fallbackTried = 'true';
                          current.src = data.assets?.mandapamStage || '/assets/images/mandapam_stage.jpg';
                        }
                      }}
                    />
                    <div className="gallery-overlay-hover">
                      <span className="gallery-icon-zoom">🔍</span>
                      <span className="gallery-title-text">{g.title}</span>
                    </div>
                  </div>
                ))
            ) : (
              <p className="no-gallery-msg" style={{ textAlign: 'center', color: '#d7c8b9', padding: '2rem' }}>
                Wedding photographs and celebration albums will be shared soon.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 8. RSVP & BLESSINGS WALL */}
      <section className="rsvp-section" id="rsvpSection">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Confirm Attendance</span>
            <h2 className="section-title">RSVP & Best Wishes</h2>
            <div className="section-divider">
              <span className="line"></span>
              <span className="flower-icon">💌</span>
              <span className="line"></span>
            </div>
          </div>

          <div className="rsvp-layout-grid">
            <div className="rsvp-form-box">
              {!data.rsvp.enabled ? (
                <div
                  className="rsvp-disabled-notice"
                  role="status"
                  style={{
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    background: 'rgba(38, 8, 13, 0.65)',
                    border: '1px solid rgba(201, 164, 92, 0.35)',
                    borderRadius: '12px'
                  }}
                >
                  <div className="disabled-icon" style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>💌</div>
                  <h4 className="disabled-title gold-text" style={{ fontSize: '1.25rem', marginBottom: '0.6rem', fontFamily: 'Cinzel, Georgia, serif' }}>
                    RSVP Concluded
                  </h4>
                  <p className="disabled-desc" style={{ color: '#d7c8b9', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {data.rsvp.disabledMessage || 'Online RSVP submissions have concluded for this auspicious celebration. Please contact the family directly with any inquiries.'}
                  </p>
                </div>
              ) : rsvpSubmitted ? (
                <div className="rsvp-success-banner" role="status" aria-live="polite">
                  <div className="success-icon">✨ 💌 🪔</div>
                  <h4 className="success-title gold-text">RSVP Received with Joy!</h4>
                  <p className="success-msg">
                    Thank you, <strong>{rsvpName}</strong>. Your response ({`Attending with ${rsvpCount}`}) and heartfelt blessings have been added to our celebration wall.
                  </p>
                  {data.rsvp.confirmationNote && (
                    <p className="confirmation-note" style={{ color: '#c9a45c', fontSize: '0.9rem', marginTop: '0.75rem', fontStyle: 'italic' }}>
                      {data.rsvp.confirmationNote}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleResetRsvp}
                    className="secondary-btn rsvp-reset-btn"
                  >
                    <span>Submit Another Response</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} noValidate>
                  <div className="form-group">
                    <label htmlFor="rsvpGuestName" className="form-label">
                      Full Name / Family Name <span className="req-star">*</span>
                    </label>
                    <input
                      type="text"
                      id="rsvpGuestName"
                      className="form-input"
                      placeholder="e.g. S. Ramulu Yadav & Family"
                      value={rsvpName}
                      onChange={(e) => {
                        setRsvpName(e.target.value);
                        if (rsvpNameError) setRsvpNameError(false);
                      }}
                      required
                      aria-invalid={rsvpNameError}
                    />
                    {rsvpNameError && (
                      <span className="form-error-msg" style={{ display: 'block' }}>
                        Please enter your name.
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="rsvpGuestsCount" className="form-label">
                      Number of Guests Attending
                    </label>
                    <select
                      id="rsvpGuestsCount"
                      className="form-select"
                      value={rsvpCount}
                      onChange={(e) => setRsvpCount(e.target.value)}
                    >
                        {(data.rsvp.guestCountOptions && data.rsvp.guestCountOptions.length > 0
                          ? data.rsvp.guestCountOptions
                          : ['1 Person', '2 Persons', '3 Persons', '4 Persons', '5+ Persons (Family)']
                        ).map((opt, idx) => (
                          <option key={idx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                  <div className="form-group">
                    <label htmlFor="rsvpMessage" className="form-label">
                      Blessings & Wishes for the Couple
                    </label>
                    <textarea
                      id="rsvpMessage"
                      className="form-textarea"
                      rows={3}
                      placeholder={`Write your heartfelt blessings for ${data.couple.groom.name} & ${data.couple.bride.name}...`}
                      value={rsvpMessage}
                      onChange={(e) => setRsvpMessage(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="submit-rsvp-btn"
                    disabled={isSubmittingRsvp}
                  >
                    <span>{isSubmittingRsvp ? 'Posting Blessings... 🪔' : 'Submit RSVP & Post Blessing'}</span>
                  </button>
                  {rsvpErrorMsg && (
                    <div className="form-error-banner" role="alert">
                      {rsvpErrorMsg}
                    </div>
                  )}
                </form>
              )}
            </div>

            <div className="blessings-wall-box">
              <div className="blessings-wall-header">
                <span className="diya-icon">🪔</span>
                <h3 className="blessings-title">Blessings from Loved Ones</h3>
              </div>
              <div className="blessings-list" role="feed">
                {blessings.map((b, idx) => (
                  <div key={idx} className="blessing-card">
                    <div className="blessing-header">
                      <span className="blessing-guest-name">🪔 {b.name}</span>
                      <span className="blessing-time">{b.time}</span>
                    </div>
                    <p className="blessing-text">"{b.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CLOSING MANGALAM */}
      <section className="closing-blessing-section" id="closingSection">
        <div className="section-container">
          <div className="mangalam-card">
            <div className="hero-divine-symbol">॥ మంగళమ్ ॥</div>
            <p className="mangalam-shloka-text">
              శ్లో॥ సర్వే భవంతు సుఖినః సర్వే సంతు నిరామయాః |<br />
              సర్వే భద్రాణి పశ్యంతు మా కశ్చిద్దుఃఖభాగ్‌భవేత్ ॥
            </p>
            <div className="closing-thank-you">Thank You • ధన్యవాదాలు</div>
            <p className="family-gratitude-text">
              "We look forward to celebrating this sacred and joyous union with you and receiving your
              heartfelt blessings."
              <br />
              <br />
              <strong>With Warmest Regards & Deepest Gratitude:</strong>
              <br />
              <strong>
                {data.invitesBy.parentsEnglish.join(' & ')} & Family
              </strong>
              <br />
              <span style={{ color: '#d4af37', fontSize: '0.95rem' }}>
                {data.invitesBy.parentsTelugu.join(' మరియు ')} మరియు కుటుంబ సభ్యులు
              </span>
            </p>

            <a
              href="#rsvpSection"
              className="primary-btn mangalam-blessings-cta"
            >
              <span>🙏 Post Your Sacred Blessings for the Couple 🙏</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="wedding-footer">
        <div className="footer-couple-names">
          {data.couple.bride.name} & {data.couple.groom.name}
        </div>
        <p className="footer-copy">
          © {new Date(data.weddingDate).getFullYear() || 2026} Auspicious Hindu Wedding Celebration • {data.venue.name}, {data.venue.city}, {data.venue.district}.
        </p>
        <div className="footer-actions-row">
          <button
            onClick={handleShareInvitation}
            className="secondary-btn footer-share-btn"
            type="button"
            style={{ fontSize: '0.8rem', padding: '0.55rem 1.4rem', minHeight: 'auto' }}
            title="Share Wedding Invitation"
          >
            <span>💌 Share Invitation</span>
          </button>
          <button
            onClick={onReplayEntry}
            className="secondary-btn footer-replay-btn"
            type="button"
            style={{ fontSize: '0.8rem', padding: '0.55rem 1.4rem', minHeight: 'auto' }}
            title="Replay Grand Entrance"
          >
            <span>🎬 Replay Grand Entrance</span>
          </button>
        </div>
      </footer>

      {/* LIGHTBOX MODAL */}
      {activeLightboxIndex !== null && (
        <div className="lightbox-modal active" role="dialog">
          <div className="lightbox-backdrop" onClick={closeLightbox}></div>
          <div className="lightbox-content">
            <button
              onClick={closeLightbox}
              className="lightbox-close-btn"
              type="button"
              aria-label="Close"
            >
              &times;
            </button>

            <button onClick={prevLightbox} className="lightbox-nav-btn lightbox-prev" type="button">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            <div className="lightbox-image-wrapper">
              <img
                src={data.gallery[activeLightboxIndex].src}
                alt={data.gallery[activeLightboxIndex].title}
                onError={(e) => {
                  const current = e.currentTarget;
                  if (!current.dataset.fallbackTried) {
                    current.dataset.fallbackTried = 'true';
                    current.src = '/assets/images/mandapam_stage.jpg';
                  }
                }}
              />
              <div className="lightbox-caption-bar">
                <div className="lightbox-caption-title">
                  {data.gallery[activeLightboxIndex].title}
                </div>
                <div className="lightbox-caption-sub">
                  {data.gallery[activeLightboxIndex].caption}
                </div>
                <div className="lightbox-counter">
                  {activeLightboxIndex + 1} / {data.gallery.length}
                </div>
              </div>
            </div>

            <button onClick={nextLightbox} className="lightbox-nav-btn lightbox-next" type="button">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* QUICK NAVIGATION FLOATING TRIGGER */}
      <button
        type="button"
        className="quick-nav-drawer-trigger"
        onClick={() => setIsNavDrawerOpen(true)}
        aria-label="Open Navigation Menu"
        title="Quick Navigation"
      >
        <span className="nav-trigger-icon">📜</span>
        <span className="nav-trigger-text">Menu</span>
      </button>

      {/* QUICK NAVIGATION OFF-CANVAS DRAWER */}
      {isNavDrawerOpen && (
        <div className="nav-drawer-overlay" onClick={() => setIsNavDrawerOpen(false)}>
          <aside
            className="nav-drawer-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Wedding Site Navigation"
          >
            <div className="nav-drawer-header">
              <div>
                <span className="nav-drawer-badge">Auspicious Wedding</span>
                <h3 className="nav-drawer-title gold-text">Lahari & Shiva Kumar</h3>
              </div>
              <button
                type="button"
                className="nav-drawer-close"
                onClick={() => setIsNavDrawerOpen(false)}
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>

            <nav className="nav-drawer-links">
              {[
                { href: '#heroInvitation', label: 'Wedding Invitation', icon: '🌸' },
                { href: '#divineBlessingSection', label: 'Divine Shloka', icon: '🕉️' },
                { href: '#countdownSection', label: 'Sumuhurtham & Countdown', icon: '🪔' },
                { href: '#coupleSection', label: 'The Bride & Groom', icon: '👫' },
                { href: '#wellWishersSection', label: 'Family & Well Wishers', icon: '🌺' },
                { href: '#ritualsSection', label: 'Sacred Ceremonies', icon: '🌿' },
                { href: '#itinerarySection', label: 'Schedule of Events', icon: '📅' },
                { href: '#venueSection', label: 'Wedding Venue', icon: '🏛️' },
                { href: '#gallerySection', label: 'Memories & Moments', icon: '📸' },
                { href: '#rsvpSection', label: 'RSVP & Blessings', icon: '💌' },
                { href: '#closingSection', label: 'Mangalam & Gratitude', icon: '🙏' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="nav-drawer-item"
                  onClick={() => setIsNavDrawerOpen(false)}
                >
                  <span className="nav-item-icon">{item.icon}</span>
                  <span className="nav-item-label">{item.label}</span>
                </a>
              ))}
            </nav>

            <div className="nav-drawer-footer">
              <button
                type="button"
                onClick={handleShareInvitation}
                className="primary-btn nav-drawer-share-btn"
                style={{ width: '100%', marginBottom: '0.65rem', fontSize: '0.8rem', padding: '0.65rem 1rem', minHeight: 'auto' }}
              >
                <span>💌 Share Invitation</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsNavDrawerOpen(false);
                  onReplayEntry();
                }}
                className="secondary-btn nav-drawer-replay"
              >
                <span>🎬 Replay Grand Entrance</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* GUEST SHARING & WEDDING QR CODE MODAL */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={data}
      />

      {/* TASTEFUL LINK COPIED TOAST BANNER */}
      {shareToast && (
        <div className="share-toast-banner" role="status" aria-live="polite">
          <span>{shareToast}</span>
        </div>
      )}
    </div>
  );
};
