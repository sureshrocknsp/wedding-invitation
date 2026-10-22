import React, { useState, useEffect } from 'react';
import { WeddingData } from '../../data/weddingData';

interface MainInvitationProps {
  data: WeddingData;
  onReplayEntry: () => void;
  onPetalBurst: (x: number, y: number, count: number) => void;
  onNavigateToKalyanam: () => void;
}

export const MainInvitation: React.FC<MainInvitationProps> = ({
  data,
  onReplayEntry,
  onPetalBurst,
  onNavigateToKalyanam
}) => {
  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEventStarted, setIsEventStarted] = useState(false);


  // Lightbox state
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // RSVP state
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [rsvpNameError, setRsvpNameError] = useState(false);
  const [blessings, setBlessings] = useState(data.rsvp.initialBlessings);

  // Personalized guest greeting from URL (?guest= or ?to=)
  const [guestParam, setGuestParam] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const g = params.get('guest') || params.get('to') || params.get('name');
    if (g) setGuestParam(g);
  }, []);

  // Countdown logic
  useEffect(() => {
    const target = new Date(data.weddingDate).getTime();
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

      setTimeLeft({ days, hours, minutes, seconds });
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

  // Handle RSVP Submit
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) {
      setRsvpNameError(true);
      return;
    }
    setRsvpNameError(false);

    const newBlessing = {
      name: rsvpName.trim(),
      time: 'Just now',
      text:
        rsvpMessage.trim() ||
        'Heartfelt congratulations & best wishes to Shiva Kumar & Lahari!'
    };

    const updated = [newBlessing, ...blessings];
    setBlessings(updated);
    try {
      localStorage.setItem('wedding_blessings_react_v1', JSON.stringify(updated));
    } catch {}

    onPetalBurst(window.innerWidth / 2, window.innerHeight / 2, 70);

    alert(
      `✨ ధన్యవాదాలు (Thank you), ${rsvpName}! ✨\n\nYour warm blessings for Lahari & Shiva Kumar have been received with joyful gratitude!`
    );

    setRsvpName('');
    setRsvpMessage('');
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

  // Add to Calendar
  const handleAddToCalendar = () => {
    const title = `Wedding of Lahari (Shireesha) & Shiva Kumar Yadav`;
    const desc = `You are cordially invited to celebrate the auspicious marriage ceremony & Sumuhurtham of Chi.La.Sow. Lahari (Shireesha) and Chi. Shiva Kumar Yadav at Brundavan Gardens, Kodangal Road, Parigi, Vikarabad Dist.`;
    const loc = `${data.venue.name}, ${data.venue.address}, ${data.venue.city}, ${data.venue.state} ${data.venue.pincode}`;
    const start = '20261101T061700Z'; // Sunday 01-Nov-2026 11:47 AM IST (06:17 UTC)
    const end = '20261101T113000Z';   // 05:00 PM IST

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${start}/${end}&details=${encodeURIComponent(desc)}&location=${encodeURIComponent(
      loc
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="main-invitation-wrapper" id="mainInvitationContent">
      {/* Top Glassmorphic Navigation Bar */}
      <header className="top-nav-bar" id="topNavBar">
        <a href="#heroInvitation" className="nav-brand">
          <span className="nav-diya">🪔</span>
          <span className="nav-brand-text">
            Lahari & Shiva Kumar
          </span>
        </a>
      </header>

      {/* 1. HERO INVITATION SECTION */}
      <section
        id="heroInvitation"
        className="hero-invitation-section"
        style={{ backgroundImage: `url('/assets/images/mandapam_stage.jpg')` }}
      >
        <div className="hero-backdrop-overlay"></div>

        <div className="hero-content-card">
          <div className="ornament-corner top-left"></div>
          <div className="ornament-corner top-right"></div>
          <div className="ornament-corner bottom-left"></div>
          <div className="ornament-corner bottom-right"></div>

          <div className="hero-divine-symbol">శ్రీరస్తు • శుభమస్తు • కళ్యాణమస్తు</div>
          <p className="hero-invocation">॥ వివాహ మహోత్సవ ఆహ్వాన శుభ పత్రిక ॥</p>

          {guestParam && (
            <div className="guest-greeting-pill">
              ✨ Cordially Inviting: <strong>{guestParam}</strong> & Family ✨
            </div>
          )}

          <h1 className="couple-names-hero">
            <div className="couple-name-row bride-row">
              <span className="formal-prefix">Chi.La.Sow.</span>
              <span className="couple-name-title gold-shimmer-text">Lahari</span>
              <span className="couple-alias-badge">(Shireesha)</span>
            </div>

            <div className="couple-ampersand-wrap">
              <span className="ampersand-flourish-line" aria-hidden="true"></span>
              <span className="couple-ampersand">&</span>
              <span className="ampersand-flourish-line" aria-hidden="true"></span>
            </div>

            <div className="couple-name-row groom-row">
              <span className="formal-prefix">Chi.</span>
              <span className="couple-name-title gold-shimmer-text">{data.couple.groom.name}</span>
            </div>
          </h1>

          <div className="hero-telugu-pair-badge">
            {data.couple.bride.teluguName} పరిణయం {data.couple.groom.teluguName}
          </div>

          <p className="hero-invitation-intro">
            We solicit your gracious presence with family and friends on the auspicious occasion of
            the marriage of our Younger Daughter.
          </p>

          <div className="hero-event-highlight">
            <div className="highlight-item">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
              </svg>
              <div className="highlight-text-wrap">
                <span className="highlight-main-title">{data.weddingDateFormatted}</span>
                <span className="highlight-sub">{data.weddingDateTelugu}</span>
              </div>
            </div>
            <div className="highlight-item">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              <div className="highlight-text-wrap">
                <span className="highlight-main-title">Sumuhurtham: {data.muhurthamTime}</span>
                <span className="highlight-sub">{data.muhurthamTimeTelugu}</span>
              </div>
            </div>
            <div className="highlight-item">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <div className="highlight-text-wrap">
                <span className="highlight-main-title">{data.venue.name}</span>
                <span className="highlight-sub">{data.venue.address}</span>
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
              May the divine celestial deities bless Chi. Shiva Kumar Yadav and Chi.La.Sow. Lahari
              with lifelong health, prosperity, harmony, and eternal companionships.
            </p>
          </div>
        </div>
      </section>

      {/* 2. LIVE COUNTDOWN & ASTROLOGY SECTION */}
      <section className="countdown-section">
        <div className="section-container">
          <div className="countdown-wrapper">
            <span className="muhurtham-badge">🪔 Auspicious Muhurtham Countdown • సుముహూర్తం 🪔</span>

            {!isEventStarted ? (
              <div className="timer-grid">
                <div className="timer-unit">
                  <div className="timer-digit">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="timer-label">Days / రోజులు</div>
                </div>
                <div className="timer-unit">
                  <div className="timer-digit">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="timer-label">Hours / గంటలు</div>
                </div>
                <div className="timer-unit">
                  <div className="timer-digit">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="timer-label">Minutes / నిమిషాలు</div>
                </div>
                <div className="timer-unit">
                  <div className="timer-digit">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="timer-label">Seconds / సెకన్లు</div>
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
                Lagnam: <strong>{data.astrology.lagnam}</strong> • Nakshatram: <strong>{data.astrology.nakshatram}</strong> • Time: <strong>11:47 AM</strong>
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

          <div className="couple-grid">
            {/* Bride Card */}
            <div className="couple-card">
              <div className="couple-avatar-frame">
                <img
                  src={data.couple.bride.photo}
                  alt={`${data.couple.bride.name} - Bride`}
                  className="couple-avatar-img bride-avatar-img"
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
                  <img src={r.image} alt={r.name} />
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
                  <p className="timeline-desc">{e.description}</p>
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
              <div className="venue-telugu-name-large">{data.venue.teluguName}</div>
              <p className="venue-address-text">
                <strong>{data.venue.address}</strong>
                <br />
                {data.venue.city}, {data.venue.district}, {data.venue.state} - {data.venue.pincode}
                <br />
                <span className="venue-landmark">Landmark: {data.venue.landmark}</span>
              </p>

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
            </div>

            <div className="venue-map-container">
              <iframe
                src={data.venue.embedMapUrl}
                loading="lazy"
                title="Brundavan Gardens Parigi Vikarabad Map"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
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
            {data.gallery.map((g, idx) => (
              <div
                key={idx}
                className="gallery-item"
                onClick={() => openLightbox(idx)}
                role="button"
                tabIndex={0}
              >
                <img src={g.src} alt={g.title} loading="lazy" />
                <div className="gallery-overlay-hover">
                  <span className="gallery-icon-zoom">🔍</span>
                  <span className="gallery-title-text">{g.title}</span>
                </div>
              </div>
            ))}
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
                    onChange={(e) => setRsvpName(e.target.value)}
                    required
                  />
                  {rsvpNameError && (
                    <span className="form-error-msg" style={{ display: 'block' }}>
                      Please enter your name.
                    </span>
                  )}
                </div>



                <div className="form-group">
                  <label htmlFor="rsvpMessage" className="form-label">
                    Blessings & Wishes for the Couple
                  </label>
                  <textarea
                    id="rsvpMessage"
                    className="form-textarea"
                    rows={3}
                    placeholder="Write your heartfelt blessings for Shiva Kumar & Lahari..."
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" className="submit-rsvp-btn">
                  <span>Submit RSVP & Post Blessing</span>
                </button>
              </form>
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
              <strong>Devarakonda & Gadde Families</strong>
              <br />
              <span style={{ color: '#d4af37', fontSize: '0.95rem' }}>
                దేవరకొండ మరియు గద్దె కుటుంబ సభ్యులు
              </span>
            </p>

            <button
              onClick={(e) => onPetalBurst(e.clientX, e.clientY, 60)}
              className="flower-shower-interactive-btn"
              type="button"
            >
              <span>🌸 Shower Holy Petals & Bless 🌸</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="wedding-footer">
        <div className="footer-couple-names">
          Lahari & Shiva Kumar Yadav
        </div>
        <p className="footer-copy">
          © 2026 Auspicious Hindu Wedding Celebration • Brundavan Gardens, Parigi, Vikarabad Dist.
        </p>
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
    </div>
  );
};
