/**
 * =========================================================================
 * ROYAL CINEMATIC HINDU WEDDING INVITATION — JAVASCRIPT CONTROLLER
 * Features:
 * 1. Initial Cinematic Loading Experience
 * 2. 3D Grand Entrance Sequencer & Vinayaka Reveal
 * 3. Web Audio API Indian Classical Synthesizer (Tanpura, Bells, Ragas)
 * 4. Realistic Canvas Flower Petal Physics & Interactive Bursts
 * 5. Live Muhurtham Countdown with Zero-State Handling
 * 6. Calendar Integration (Google Calendar & .ICS File Generator)
 * 7. Lightbox Gallery with Keyboard & Mobile Touch Swipe
 * 8. Interactive RSVP Form with Attendance Toggle & Live Blessings Wall
 * 9. Image Fallback System & Responsive Mobile Navigation
 * =========================================================================
 */

(function () {
  'use strict';

  // --- DATA SOURCE (From weddingData.js or Fallback) ---
  const DATA = window.WEDDING_DATA || {
    couple: {
      bride: { name: "Ananya", fullName: "Ananya Sundararajan" },
      groom: { name: "Aditya", fullName: "Aditya Natarajan" }
    },
    weddingDate: "2026-11-28T09:15:00+05:30",
    weddingDateFormatted: "Saturday, 28th November 2026",
    muhurthamTime: "09:15 AM - 10:30 AM",
    venue: {
      name: "Sri Meenakshi Sundareswarar Kalyana Mandapam",
      address: "No. 42, Temple Ring Road, Raja Annamalaipuram",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600028",
      googleMapsUrl: "https://maps.google.com/?q=Chennai+Tamil+Nadu"
    },
    gallery: [
      { src: "assets/images/couple_portrait.jpg", title: "Pre-Wedding Moments", caption: "Two souls bound by love and timeless tradition" },
      { src: "assets/images/ritual_muhurtham.jpg", title: "Sacred Muhurtham", caption: "The divine moment of Mangalyadharanam" },
      { src: "assets/images/ritual_haldi.jpg", title: "Joyous Haldi Celebrations", caption: "Golden turmeric showers & family laughter" },
      { src: "assets/images/ritual_reception.jpg", title: "Royal Reception Evening", caption: "Welcoming friends & family under grand chandeliers" },
      { src: "assets/images/mandapam_stage.jpg", title: "Grand Mandapam Stage", caption: "Adorned with fragrant jasmine & marigold canopies" },
      { src: "assets/images/grand_doors.jpg", title: "Temple Palace Entrance", caption: "Intricately carved grand wooden wedding entrance" }
    ],
    rsvp: {
      initialBlessings: [
        { name: "K. Sundararajan & Family", time: "Just now", text: "May Lord Vinayaka bestow abundant health, prosperity, and endless joy upon Ananya & Aditya!" },
        { name: "Meenakshi & Natarajan", time: "2 hours ago", text: "Heartiest congratulations! Looking forward to being part of this sacred celebration." },
        { name: "Suresh & Priya", time: "Yesterday", text: "Wishing the wonderful couple a lifetime of love, harmony, and togetherness!" }
      ]
    }
  };

  // --- DOM ELEMENTS ---
  const initialLoader = document.getElementById('initialLoader');
  const cinematicStage = document.getElementById('cinematicStage');
  const openDoorsBtn = document.getElementById('openDoorsBtn');
  const proceedToInviteBtn = document.getElementById('proceedToInviteBtn');
  const stageInterior = document.getElementById('stageInterior');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const replayEntranceBtn = document.getElementById('replayEntranceBtn');
  const flowerShowerBtn = document.getElementById('flowerShowerBtn');
  const topNavBar = document.getElementById('topNavBar');
  const guestGreetingPill = document.getElementById('guestGreetingPill');
  const rsvpForm = document.getElementById('rsvpForm');
  const blessingsList = document.getElementById('blessingsList');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavClose = document.getElementById('mobileNavClose');

  // Lightbox DOM Elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCaptionTitle = document.getElementById('lightboxCaptionTitle');
  const lightboxCaptionSub = document.getElementById('lightboxCaptionSub');
  const lightboxCounter = document.getElementById('lightboxCounter');

  let currentGalleryIndex = 0;
  let isDoorsOpen = false;
  let isCinematicActive = true;
  let autoOpenTimer = null;

  // =========================================================================
  // 1. INITIAL LOADING SCREEN CONTROLLER (SECTION 4)
  // =========================================================================
  function initLoader() {
    if (!initialLoader) return;
    
    // Smooth transition from loading screen to closed door grand entrance
    setTimeout(() => {
      initialLoader.classList.add('loaded');
      initialLoader.setAttribute('aria-hidden', 'true');
      
      // Start subtle ambient scene after loader fades
      setTimeout(() => {
        startAmbientEntranceAnimation();
      }, 500);
    }, 1400);
  }

  // =========================================================================
  // 2. GRAND ENTRANCE SEQUENCER & VINAYAKA REVEAL (SECTIONS 8, 9, 11, 14)
  // =========================================================================
  function startAmbientEntranceAnimation() {
    // 0-4s: User explores closed doors with shimmering seam light
    // 6-8s: Optional subtle auto-prompt or auto-start if user hasn't tapped yet
    autoOpenTimer = setTimeout(() => {
      if (!isDoorsOpen && isCinematicActive) {
        // Subtle hint pulse
        if (openDoorsBtn) {
          openDoorsBtn.style.animation = 'pulseBtn 1.5s infinite';
        }
      }
    }, 6000);
  }

  function triggerDoorOpening() {
    if (isDoorsOpen) return;
    isDoorsOpen = true;
    if (autoOpenTimer) clearTimeout(autoOpenTimer);

    // 1. Start audio synth engine on first user gesture
    audioEngine.start();
    audioEngine.playTempleBell();

    // 2. Camera Push-in and 3D Door Rotation
    if (cinematicStage) {
      cinematicStage.classList.add('camera-push');
      
      setTimeout(() => {
        cinematicStage.classList.add('doors-opened');
      }, 350);

      // 3. Lord Vinayaka Reveal at ~65% door opening (approx 1.5s)
      setTimeout(() => {
        if (stageInterior) {
          stageInterior.classList.add('revealed');
          stageInterior.setAttribute('aria-hidden', 'false');
        }
        // Shower golden & marigold petals upon revelation
        petalSystem.burst(window.innerWidth / 2, window.innerHeight * 0.45, 65);
      }, 1600);
    }
  }

  function proceedToMainInvitation() {
    if (cinematicStage) {
      cinematicStage.classList.add('stage-dismissed');
      document.body.classList.remove('doors-locked');
      isCinematicActive = false;

      // Smooth scroll to the main Hero Invitation card
      setTimeout(() => {
        const heroSection = document.getElementById('heroInvitation');
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 250);
    }
  }

  function replayCinematicEntrance() {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.body.classList.add('doors-locked');
    isDoorsOpen = false;
    isCinematicActive = true;

    if (cinematicStage) {
      cinematicStage.classList.remove('stage-dismissed', 'doors-opened', 'camera-push');
      if (stageInterior) {
        stageInterior.classList.remove('revealed');
        stageInterior.setAttribute('aria-hidden', 'true');
      }
    }
  }

  // Keyboard accessibility for entrance (Enter / Space opens doors)
  function initEntranceKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (isCinematicActive && !isDoorsOpen) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerDoorOpening();
        }
      }
    });
  }

  // =========================================================================
  // 3. INDIAN CLASSICAL WEB AUDIO API SYNTHESIZER (SECTIONS 24 & 29)
  // =========================================================================
  class IndianWeddingAudioEngine {
    constructor() {
      this.ctx = null;
      this.isPlaying = false;
      this.tanpuraGain = null;
      this.melodyInterval = null;
      this.isInitialized = false;
    }

    init() {
      if (this.isInitialized) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.isInitialized = true;
    }

    start() {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      if (!this.isPlaying) {
        this.startTanpuraDrone();
        this.startMelodicPhrases();
        this.isPlaying = true;
        this.updateUI(true);
      }
    }

    stop() {
      if (this.tanpuraGain && this.ctx) {
        this.tanpuraGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      }
      if (this.melodyInterval) {
        clearInterval(this.melodyInterval);
        this.melodyInterval = null;
      }
      this.isPlaying = false;
      this.updateUI(false);
    }

    toggle() {
      if (this.isPlaying) {
        this.stop();
      } else {
        this.start();
      }
    }

    updateUI(playing) {
      if (audioToggleBtn) {
        if (playing) {
          audioToggleBtn.classList.add('playing');
          audioToggleBtn.setAttribute('aria-label', 'Mute Traditional Wedding Music');
        } else {
          audioToggleBtn.classList.remove('playing');
          audioToggleBtn.setAttribute('aria-label', 'Play Traditional Wedding Music');
        }
      }
    }

    // Sacred Temple Bell (Ghanta) with physical harmonic partials
    playTempleBell(freq = 587.33) { // D5
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const partials = [1, 2.01, 3.02, 4.2, 5.4];
      const gains = [0.35, 0.22, 0.14, 0.07, 0.03];

      partials.forEach((p, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * p, now);

        gain.gain.setValueAtTime(gains[idx] * 0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2 + (idx * 0.4));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 4.2);
      });
    }

    // Resonant Indian Tanpura Drone (Sa - Pa - Sa Tuning in Key of D)
    startTanpuraDrone() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const masterDroneGain = this.ctx.createGain();
      masterDroneGain.gain.setValueAtTime(0.001, now);
      masterDroneGain.gain.exponentialRampToValueAtTime(0.16, now + 1.8);
      masterDroneGain.connect(this.ctx.destination);
      this.tanpuraGain = masterDroneGain;

      // Base pitches: Pa (A2 = 110Hz), Sa (D3 = 146.83Hz), Sa octave (D4 = 293.66Hz)
      const freqs = [110, 146.83, 220, 293.66];
      freqs.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();

        osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(f, now);

        // Lowpass warm filter for temple sanctum acoustics
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(420 + (i * 70), now);
        filter.Q.setValueAtTime(2.5, now);

        // Gentle Javari shimmering string buzz
        lfo.frequency.setValueAtTime(0.2 + (i * 0.1), now);
        lfoGain.gain.setValueAtTime(1.4, now);
        lfo.connect(osc.frequency);

        osc.connect(filter);
        filter.connect(masterDroneGain);

        osc.start(now);
        lfo.start(now);
      });
    }

    // Auspicious Melodic Phrases (Hamsadhwani & Kalyani Raga Notes)
    startMelodicPhrases() {
      const ragaScale = [
        293.66, // D4 (Sa)
        329.63, // E4 (Ri)
        369.99, // F#4 (Ga)
        440.00, // A4 (Pa)
        493.88, // B4 (Ni)
        587.33, // D5 (Sa')
        659.25, // E5 (Ri')
        739.99  // F#5 (Ga')
      ];

      const playMelodyNote = () => {
        if (!this.isPlaying || !this.ctx) return;
        const now = this.ctx.currentTime;
        const noteFreq = ragaScale[Math.floor(Math.random() * ragaScale.length)];
        const duration = 1.3 + Math.random() * 1.4;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(noteFreq, now);

        // Expressive Indian Gamaka (graceful pitch glide)
        if (Math.random() > 0.4) {
          const targetFreq = ragaScale[Math.floor(Math.random() * ragaScale.length)];
          osc.frequency.setTargetAtTime(targetFreq, now + 0.25, 0.35);
        }

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100, now);
        filter.Q.setValueAtTime(1.4, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.07, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration + 0.2);
      };

      this.melodyInterval = setInterval(() => {
        if (Math.random() > 0.25) {
          playMelodyNote();
        }
      }, 1900);
    }
  }

  const audioEngine = new IndianWeddingAudioEngine();

  // =========================================================================
  // 4. CANVAS FLOWER PETAL PARTICLE PHYSICS (SECTION 25)
  // =========================================================================
  class PetalParticleSystem {
    constructor() {
      this.canvas = document.getElementById('petalCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.petals = [];
      this.maxPetals = 40;
      this.colors = [
        '#ffb703', // Marigold Yellow
        '#fb8500', // Marigold Orange
        '#e63946', // Rose Crimson
        '#f8f9fa', // Jasmine White
        '#ffd166'  // Golden Petal
      ];
      this.resize();
      this.init();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    init() {
      for (let i = 0; i < this.maxPetals; i++) {
        this.petals.push(this.createPetal(Math.random() * this.canvas.width, Math.random() * this.canvas.height));
      }
      this.animate();
    }

    createPetal(x, y, isBurst = false) {
      return {
        x: x || Math.random() * this.canvas.width,
        y: y !== undefined ? y : -20,
        size: 7 + Math.random() * 11,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        speedX: isBurst ? (Math.random() - 0.5) * 7.5 : (Math.random() - 0.5) * 1.4,
        speedY: isBurst ? -2 - Math.random() * 5.5 : 0.9 + Math.random() * 2.0,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.8,
        oscillationSpeed: 0.02 + Math.random() * 0.03,
        oscillationAngle: Math.random() * Math.PI * 2,
        opacity: 0.75 + Math.random() * 0.25,
        isBurst: isBurst
      };
    }

    burst(x, y, count = 50) {
      for (let i = 0; i < count; i++) {
        this.petals.push(this.createPetal(x, y, true));
      }
    }

    animate() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.petals.length - 1; i >= 0; i--) {
        const p = this.petals[i];
        p.oscillationAngle += p.oscillationSpeed;
        p.x += p.speedX + Math.sin(p.oscillationAngle) * 0.75;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.isBurst) {
          p.speedY += 0.14; // Gravity
          p.speedX *= 0.98; // Air resistance
        }

        // Render delicate organic petal ellipse
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        // Recycle petal when falling off screen
        if (p.y > this.canvas.height + 30 || p.x < -40 || p.x > this.canvas.width + 40) {
          if (p.isBurst) {
            this.petals.splice(i, 1);
          } else {
            this.petals[i] = this.createPetal(Math.random() * this.canvas.width, -20);
          }
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  const petalSystem = new PetalParticleSystem();

  // =========================================================================
  // 5. LIVE MUHURTHAM COUNTDOWN TIMER (SECTION 21)
  // =========================================================================
  function initCountdown() {
    const daysEl = document.getElementById('timerDays');
    const hoursEl = document.getElementById('timerHours');
    const minsEl = document.getElementById('timerMins');
    const secsEl = document.getElementById('timerSecs');
    const zeroMsgEl = document.getElementById('countdownZeroMsg');
    const timerGrid = document.getElementById('timerGrid');

    if (!daysEl) return;

    const targetDate = new Date(DATA.weddingDate).getTime();

    function updateTimer() {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        if (zeroMsgEl && timerGrid) {
          zeroMsgEl.style.display = 'block';
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      daysEl.textContent = String(Math.max(0, days)).padStart(2, '0');
      hoursEl.textContent = String(Math.max(0, hours)).padStart(2, '0');
      minsEl.textContent = String(Math.max(0, minutes)).padStart(2, '0');
      secsEl.textContent = String(Math.max(0, seconds)).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // =========================================================================
  // 6. ADD TO CALENDAR (.ICS & GOOGLE CALENDAR)
  // =========================================================================
  function initCalendarActions() {
    const calendarBtn = document.getElementById('addToCalendarBtn');
    if (!calendarBtn) return;

    calendarBtn.addEventListener('click', () => {
      const eventTitle = `Wedding Celebration of ${DATA.couple.bride.name} & ${DATA.couple.groom.name}`;
      const eventDetails = `You are cordially invited to celebrate the holy wedding ceremony of ${DATA.couple.bride.name} & ${DATA.couple.groom.name}. Venue: ${DATA.venue.name}`;
      const location = `${DATA.venue.name}, ${DATA.venue.address}, ${DATA.venue.city}`;
      const startTime = "20261128T034500Z"; // 9:15 AM IST in UTC
      const endTime = "20261128T063000Z";   // 12:00 PM IST in UTC

      // Google Calendar URL
      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(location)}`;

      // Generate downloadable .ics content
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Auspicious Hindu Wedding//EN",
        "BEGIN:VEVENT",
        `SUMMARY:${eventTitle}`,
        `DESCRIPTION:${eventDetails}`,
        `LOCATION:${location}`,
        `DTSTART:${startTime}`,
        `DTEND:${endTime}`,
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      // Open Google Calendar in new tab
      window.open(googleCalUrl, '_blank');

      // Also trigger .ics file download
      try {
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', `Wedding-${DATA.couple.bride.name}-${DATA.couple.groom.name}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {}
    });
  }

  // =========================================================================
  // 7. PHOTO GALLERY LIGHTBOX (SECTION 22)
  // =========================================================================
  function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryData = DATA.gallery || [];

    function showLightbox(index) {
      if (index < 0) index = galleryData.length - 1;
      if (index >= galleryData.length) index = 0;
      currentGalleryIndex = index;

      const item = galleryData[currentGalleryIndex];
      if (!item || !lightboxModal || !lightboxImg) return;

      lightboxImg.src = item.src;
      lightboxImg.alt = item.title;
      if (lightboxCaptionTitle) lightboxCaptionTitle.textContent = item.title;
      if (lightboxCaptionSub) lightboxCaptionSub.textContent = item.caption;
      if (lightboxCounter) lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryData.length}`;

      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
      if (lightboxModal) {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
      }
    }

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index') || '0', 10);
        showLightbox(idx);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightbox(currentGalleryIndex - 1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => showLightbox(currentGalleryIndex + 1));

    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop')) {
          closeLightbox();
        }
      });
    }

    // Keyboard support (ArrowLeft, ArrowRight, Escape)
    document.addEventListener('keydown', (e) => {
      if (lightboxModal && lightboxModal.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showLightbox(currentGalleryIndex - 1);
        if (e.key === 'ArrowRight') showLightbox(currentGalleryIndex + 1);
      }
    });

    // Mobile touch swipe gestures
    let touchStartX = 0;
    let touchEndX = 0;

    if (lightboxModal) {
      lightboxModal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      lightboxModal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 45) {
          if (diff > 0) {
            showLightbox(currentGalleryIndex - 1); // Swipe Right -> Prev
          } else {
            showLightbox(currentGalleryIndex + 1); // Swipe Left -> Next
          }
        }
      }, { passive: true });
    }
  }

  // =========================================================================
  // 8. INTERACTIVE RSVP & BLESSINGS WALL (SECTION 23)
  // =========================================================================
  function initBlessingsWall() {
    const defaultBlessings = DATA.rsvp?.initialBlessings || [
      { name: "K. Sundararajan & Family", time: "Just now", text: "May Lord Vinayaka bestow abundant health, prosperity, and endless joy upon the couple!" },
      { name: "Meenakshi & Natarajan", time: "2 hours ago", text: "Heartiest congratulations! Looking forward to being part of this sacred celebration." },
      { name: "Suresh & Priya", time: "Yesterday", text: "Wishing the wonderful couple a lifetime of love, harmony, and togetherness!" }
    ];

    let storedBlessings = [];
    try {
      const raw = localStorage.getItem('wedding_blessings_wall_v2');
      storedBlessings = raw ? JSON.parse(raw) : defaultBlessings;
    } catch (e) {
      storedBlessings = defaultBlessings;
    }

    renderBlessings(storedBlessings);

    // Attendance radio pills toggle
    const radioPills = document.querySelectorAll('.attendance-radio-pill');
    const eventsGroup = document.getElementById('eventsCheckboxGroup');
    radioPills.forEach(pill => {
      pill.addEventListener('click', () => {
        radioPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const radio = pill.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          if (eventsGroup) {
            eventsGroup.style.display = radio.value === 'decline' ? 'none' : 'block';
          }
        }
      });
    });

    if (rsvpForm) {
      rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('rsvpGuestName');
        const countSelect = document.getElementById('rsvpGuestCount');
        const messageTextarea = document.getElementById('rsvpMessage');
        const nameError = document.getElementById('nameError');
        const attendanceRadio = document.querySelector('input[name="rsvpAttendance"]:checked');

        const guestName = nameInput ? nameInput.value.trim() : '';
        const guestCount = countSelect ? countSelect.value : '2';
        const message = messageTextarea ? messageTextarea.value.trim() : '';
        const isAttending = attendanceRadio ? attendanceRadio.value === 'accept' : true;

        if (!guestName) {
          if (nameError) nameError.style.display = 'block';
          if (nameInput) nameInput.focus();
          return;
        } else {
          if (nameError) nameError.style.display = 'none';
        }

        // Construct blessing entry
        const newBlessing = {
          name: guestName,
          time: "Just now",
          text: message || (isAttending ? "Sending our heartfelt blessings and looking forward to the sacred celebration!" : "Sending our heartfelt prayers and warmest wishes for a blessed marriage!")
        };

        storedBlessings.unshift(newBlessing);
        try {
          localStorage.setItem('wedding_blessings_wall_v2', JSON.stringify(storedBlessings));
        } catch (err) {}

        renderBlessings(storedBlessings);

        // Celebratory bursts
        petalSystem.burst(window.innerWidth / 2, window.innerHeight / 2, 70);
        audioEngine.playTempleBell();

        const responseMsg = isAttending
          ? `✨ Dhanyavaad, ${guestName}! ✨\n\nYour RSVP for ${guestCount} guest(s) and warm blessings have been joyfully received with deep gratitude!`
          : `✨ Dhanyavaad, ${guestName}! ✨\n\nThank you for your warm wishes and prayers. We deeply cherish your heartfelt blessings!`;

        alert(responseMsg);
        rsvpForm.reset();
      });
    }
  }

  function renderBlessings(list) {
    if (!blessingsList) return;
    blessingsList.innerHTML = list.map(b => `
      <div class="blessing-card fade-in-up active">
        <div class="blessing-header">
          <span class="blessing-guest-name">🪔 ${escapeHtml(b.name)}</span>
          <span class="blessing-time">${escapeHtml(b.time)}</span>
        </div>
        <p class="blessing-text">"${escapeHtml(b.text)}"</p>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // =========================================================================
  // 9. GUEST PERSONALIZATION VIA URL PARAMS (SECTION 16)
  // =========================================================================
  function initPersonalization() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('guest') || urlParams.get('to') || urlParams.get('name');
    if (guestParam && guestGreetingPill) {
      guestGreetingPill.innerHTML = `✨ Cordially Inviting: <strong>${escapeHtml(guestParam)}</strong> & Family ✨`;
      guestGreetingPill.style.display = 'inline-block';
    }
  }

  // =========================================================================
  // 10. MOBILE NAVIGATION DRAWER & SCROLL EFFECTS (SECTION 27)
  // =========================================================================
  function initNavigation() {
    if (mobileMenuToggle && mobileNavDrawer) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileNavDrawer.classList.toggle('active');
        mobileNavDrawer.setAttribute('aria-hidden', mobileNavDrawer.classList.contains('active') ? 'false' : 'true');
      });
    }

    if (mobileNavClose && mobileNavDrawer) {
      mobileNavClose.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('active');
        mobileNavDrawer.setAttribute('aria-hidden', 'true');
      });
    }

    // Close mobile drawer on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNavDrawer) {
          mobileNavDrawer.classList.remove('active');
          mobileNavDrawer.setAttribute('aria-hidden', 'true');
        }
      });
    });

    // Glassmorphism Navbar effect on scroll
    window.addEventListener('scroll', () => {
      if (topNavBar) {
        if (window.scrollY > 80) {
          topNavBar.classList.add('scrolled');
        } else {
          topNavBar.classList.remove('scrolled');
        }
      }
    });
  }

  // =========================================================================
  // 11. SCROLL REVEAL OBSERVER
  // =========================================================================
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
  }

  // =========================================================================
  // 12. IMAGE FALLBACK SYSTEM (SECTION 32)
  // =========================================================================
  function initImageFallbacks() {
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function () {
        this.classList.add('img-fallback-applied');
        this.style.opacity = '0.7';
        this.alt = 'Auspicious Wedding Visual';
      });
    });
  }

  // =========================================================================
  // 13. MASTER INITIALIZATION
  // =========================================================================
  function init() {
    initLoader();
    initEntranceKeyboard();
    initPersonalization();
    initCountdown();
    initCalendarActions();
    initBlessingsWall();
    initGalleryLightbox();
    initNavigation();
    initScrollAnimations();
    initImageFallbacks();

    // Attach Event Listeners
    if (openDoorsBtn) {
      openDoorsBtn.addEventListener('click', triggerDoorOpening);
    }

    if (cinematicStage) {
      cinematicStage.addEventListener('click', (e) => {
        if (!isDoorsOpen && !e.target.closest('#proceedToInviteBtn')) {
          triggerDoorOpening();
        }
      });
    }

    if (proceedToInviteBtn) {
      proceedToInviteBtn.addEventListener('click', proceedToMainInvitation);
    }

    if (replayEntranceBtn) {
      replayEntranceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        replayCinematicEntrance();
      });
    }

    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', () => {
        audioEngine.toggle();
      });
    }

    if (flowerShowerBtn) {
      flowerShowerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        petalSystem.burst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 65);
        audioEngine.playTempleBell(659.25);
      });
    }

    // Global ambient petal burst on background click
    document.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('select') || e.target.closest('a')) return;
      if (Math.random() > 0.45) {
        petalSystem.burst(e.clientX, e.clientY, 14);
      }
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
