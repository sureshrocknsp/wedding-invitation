import React, { useState, useEffect } from 'react';
import { WeddingData } from '../../data/weddingData';

interface SacredKalyanamPageProps {
  data: WeddingData;
  onBack: () => void;
}

export const SacredKalyanamPage: React.FC<SacredKalyanamPageProps> = ({
  data,
  onBack
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sacred-kalyanam-page-root animate-page-fade-in">
      {/* Top Navigation Bar */}
      <header className="top-nav-bar kalyanam-page-nav">
        <button
          onClick={onBack}
          className="nav-btn back-to-invite-btn"
          type="button"
          aria-label="Back to Wedding Invitation"
        >
          <span className="back-btn-desktop">← Back to Wedding Invitation</span>
          <span className="back-btn-mobile">← Back</span>
        </button>

        <div className="nav-brand kalyanam-brand">
          <span className="nav-diya">🪔</span>
          <span className="nav-brand-text">
            {data.couple.bride.name} & {data.couple.groom.name}
          </span>
        </div>

        <div className="nav-actions">
          <button
            onClick={onBack}
            className="nav-btn kalyanam-nav-action-btn"
            type="button"
            title="Return to Main Invitation"
          >
            <span>🪷 Invitation</span>
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="kalyanam-page-container">
        {/* Page Hero Header */}
        <section className="kalyanam-hero-header">
          <div className="hero-divine-symbol">శ్రీరస్తు • శుభమస్తు • కళ్యాణమస్తు</div>
          <span className="section-tag">వివాహ విశిష్టత & సప్తపది</span>
          <h1 className="kalyanam-page-title gold-shimmer-text">
            The Sacred Essence of Telugu Kalyanam
          </h1>
          <div className="section-divider">
            <span className="line"></span>
            <span className="flower-icon">🔥</span>
            <span className="line"></span>
          </div>
          <p className="kalyanam-page-subtitle">
            సనాతన ధర్మం • అగ్నిసాక్షిగా ఏడడుగుల అనుబంధం • సర్వదేవతా దివ్య ఆశీర్వాదములు
          </p>
        </section>

        {/* 1. Divine Celestial Blessings Section with Painting */}
        <section className="divine-celestial-section">
          <div className="divine-blessings-hero-card">
            <div className="divine-frame-border">
              <div
                className="divine-image-container"
                onClick={() => setIsLightboxOpen(true)}
                title="Click to view full resolution artwork"
                role="button"
                tabIndex={0}
              >
                <img
                  src="/assets/images/divine_blessings.jpg"
                  alt="Supreme Deities Showering Divine Blessings upon Lahari and Shiva Kumar"
                  className="divine-blessings-img"
                />
                <div className="divine-image-overlay">
                  <span className="divine-shimmer-tag">
                    ✨ సర్వదేవతా ఆశీర్వచనం • Divine Celestial Shower of Blessings ✨
                  </span>
                </div>
              </div>

              <div className="divine-blessing-text-box">
                <div className="divine-shloka-title">
                  శ్లో॥ బ్రహ్మ మురారి త్రిపురాంతకారీ భానుః శశీ భూమిసుతో బుధశ్చ ।<br />
                  గురుశ్చ శుక్రః శని రాహు కేతవః కుర్వంతు సర్వే శుభమాదధాతు ॥
                </div>
                <p className="divine-explanation">
                  "May Lord Venkateswara, Goddess Lakshmi, Lord Shiva, Goddess Parvati, Lord Ganesha, and all heavenly Devas shower eternal golden petals, holy Akshatas, and divine grace upon <strong>{data.couple.bride.fullName}</strong> and <strong>{data.couple.groom.fullName}</strong> for a lifetime of devotion, harmony, and prosperity."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Philosophy & Importance of South Indian Telugu Marriage */}
        <section className="marriage-importance-overview">
          <div className="importance-intro-card">
            <h2 className="importance-title gold-shimmer-text">
              తెలుగు వివాహ విశిష్టత — The Sacred Meaning of Kalyanam
            </h2>
            <p className="importance-desc">
              In South Indian Telugu tradition, wedding is not merely a social contract, but a sacred <strong>సంస్కారం (Samskara)</strong>. Solemnized before the holy Agni fire (అగ్నిసాక్షిగా) and consecrated with Vedic mantras, marriage is the timeless union of two souls and two families across seven lifetimes (జన్మజన్మల అనుబంధం).
            </p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-item">
              <div className="pillar-icon">🌿</div>
              <h3>ధర్మ సహచర్యము (Righteous Life)</h3>
              <p>Walking together in dharma, sharing moral duties, spiritual pursuits, and upholding respected family heritage.</p>
            </div>
            <div className="pillar-item">
              <div className="pillar-icon">🪔</div>
              <h3>మాంగళ్యధారణం (3 Holy Knots)</h3>
              <p>Tying the sacred Mangalasutra with 3 holy knots: 1st for husband, 2nd for ancestors & family, 3rd for society & God.</p>
            </div>
            <div className="pillar-item">
              <div className="pillar-icon">🍯</div>
              <h3>జీలకర్ర బెల్లం (Inseparable Love)</h3>
              <p>Cumin and jaggery paste placed on each other's heads symbolizing that bitter & sweet moments dissolve into eternal sweetness.</p>
            </div>
            <div className="pillar-item">
              <div className="pillar-icon">🌾</div>
              <h3>తలంబ్రాలు (Joyful Abundance)</h3>
              <p>Pouring sanctified turmeric pearls and rice over one another, celebrating an overflowing harvest of mutual joy and prosperity.</p>
            </div>
          </div>
        </section>

        {/* 3. The 7 Sacred Vows (సప్తపది — ఏడు అడుగులు & ఏడు వాగ్దానాలు) */}
        <section className="sapthapadi-vows-wrapper">
          <div className="vows-heading-row">
            <span className="vows-badge">ఏడు అడుగులు • ఏడు వాగ్దానాలు</span>
            <h2 className="vows-main-title gold-shimmer-text">
              The Seven Sacred Vows of Saptapadi (సప్తపది)
            </h2>
            <p className="vows-sub-desc">
              Seven holy steps taken around the consecrated Agni fire, each step solemnizing an eternal promise of companionship, strength, and love:
            </p>
          </div>

          <div className="seven-steps-grid">
            {/* Step 1 */}
            <div className="vow-step-card">
              <div className="step-number-bubble">1</div>
              <div className="step-content">
                <div className="step-mantra">ఓం ఏకమిషే విష్ణుస్త్వాన్వేతు</div>
                <h3 className="step-title">మొదటి అడుగు — ఆహారము & జీవన పోషణ (Nourishment & Health)</h3>
                <p className="step-telugu-desc">
                  నూతన దాంపత్య జీవితంలో ఆహార ధాన్యములకు, పోషణకు ఎన్నడూ లోటు లేకుండా, ఆయురారోగ్యాలతో ధర్మమార్గంలో మొదటి అడుగు.
                </p>
                <p className="step-eng-desc">
                  <em>"Together we step forward to provide wholesome nourishment, pure health, and shared sustenance for our home."</em>
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="vow-step-card">
              <div className="step-number-bubble">2</div>
              <div className="step-content">
                <div className="step-mantra">ఓం ద్వే ఊర్జే విష్ణుస్త్వాన్వేతు</div>
                <h3 className="step-title">రెండో అడుగు — ఆత్మస్థైర్యం & మనోబలం (Strength & Courage)</h3>
                <p className="step-telugu-desc">
                  కష్టసుఖాలలో ఒకరికొకరు తోడుగా ఉంటూ, మానసిక, శారీరక శక్తితో సంసార బాధ్యతలను నిర్వర్తించడానికి రెండో అడుగు.
                </p>
                <p className="step-eng-desc">
                  <em>"Together we step forward to foster physical vigor and mental courage, standing steadfast through every tide of life."</em>
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="vow-step-card">
              <div className="step-number-bubble">3</div>
              <div className="step-content">
                <div className="step-mantra">ఓం త్రీణి రాయస్పోషాయ విష్ణుస్త్వాన్వేతు</div>
                <h3 className="step-title">మూడో అడుగు — ధనధాన్యాలు & సత్కర్మలు (Prosperity & Righteous Wealth)</h3>
                <p className="step-telugu-desc">
                  ధర్మబద్ధమైన సంపాదనతో సంపదను వృద్ధి చేసుకుంటూ, సమాజ సేవ, దానధర్మాలు, సత్కార్యాల ఆచరణకు మూడో అడుగు.
                </p>
                <p className="step-eng-desc">
                  <em>"Together we step forward to earn honorable wealth, support our loved ones, and perform noble philanthropic deeds."</em>
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="vow-step-card">
              <div className="step-number-bubble">4</div>
              <div className="step-content">
                <div className="step-mantra">ఓం చత్వారి మయోభవాయ విష్ణుస్త్వాన్వేతు</div>
                <h3 className="step-title">నాలుగో అడుగు — సుఖసంతోషాలు & అనురాగం (Harmony & Affection)</h3>
                <p className="step-telugu-desc">
                  పరస్పర గౌరవంతో, నిష్కల్మషమైన ప్రేమతో, కుటుంబంలో ఆనందం మరియు ప్రశాంతతను వెల్లివిరియించడానికి నాలుగో అడుగు.
                </p>
                <p className="step-eng-desc">
                  <em>"Together we step forward to nurture mutual devotion, shared joy, family serenity, and unconditional understanding."</em>
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="vow-step-card">
              <div className="step-number-bubble">5</div>
              <div className="step-content">
                <div className="step-mantra">ఓం పంచ పశుభ్యో విష్ణుస్త్వాన్వేతు</div>
                <h3 className="step-title">ఐదో అడుగు — వంశాభివృద్ధి & ఉత్తమ సంతానం (Lineage & Noble Progeny)</h3>
                <p className="step-telugu-desc">
                  ఉత్తమ సంతానాన్ని పొంది, వారిని సంస్కారవంతులుగా తీర్చిదిద్దుతూ, వంశ గౌరవాన్ని సదా కాపాడేందుకు ఐదో అడుగు.
                </p>
                <p className="step-eng-desc">
                  <em>"Together we step forward for righteous progeny, bestowing timeless cultural virtues upon future generations."</em>
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="vow-step-card">
              <div className="step-number-bubble">6</div>
              <div className="step-content">
                <div className="step-mantra">ఓం షడృతుభ్యో విష్ణుస్త్వాన్వేతు</div>
                <h3 className="step-title">ఆరో అడుగు — సర్వ రుతువుల ఆయురారోగ్యాలు (Lifelong Devotion Across Seasons)</h3>
                <p className="step-telugu-desc">
                  సంవత్సరంలోని ఆరు రుతువులలో, జీవితంలోని ప్రతి దశలో ఒకరి ఆనందంలో ఒకరు భాగమై కలకాలం తోడుండటానికి ఆరో అడుగు.
                </p>
                <p className="step-eng-desc">
                  <em>"Together we step forward to remain united across all seasons and ages of life in unwavering health and companionship."</em>
                </p>
              </div>
            </div>

            {/* Step 7 */}
            <div className="vow-step-card highlight-step-seven">
              <div className="step-number-bubble gold-bubble">7</div>
              <div className="step-content">
                <div className="step-mantra">ఓం సప్త సప్తభ్యో హోత్రాభ్యో విష్ణుస్త్వాన్వేతు • సఖా సప్తపదా భవ</div>
                <h3 className="step-title">ఏడో అడుగు — శాశ్వత స్నేహం & పరిపూర్ణ ఐక్యత (Eternal Friendship & Sacred Union)</h3>
                <p className="step-telugu-desc">
                  'సఖా సప్తపదా భవ' — ఏడు అడుగులు పూర్తిచేసి పరమ ఆప్తమిత్రురాలిగా, అర్ధాంగిగా ఆయుష్షున్నంతవరకు కలసి నడిచే శాశ్వత బంధానికి ఏడో అడుగు.
                </p>
                <p className="step-eng-desc">
                  <em>"Having walked seven sacred steps with me, become my eternal companion. With seven steps our friendship and union are solemnized for all lifetimes."</em>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA to Return to Main Invitation */}
        <section className="kalyanam-page-footer-cta">
          <button
            onClick={onBack}
            className="primary-btn return-invite-btn"
            type="button"
          >
            <span>← Return to Wedding Invitation</span>
          </button>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="wedding-footer">
        <div className="footer-couple-names">
          {data.couple.bride.name} & {data.couple.groom.name}
        </div>
        <p className="footer-copy">
          © 2026 Auspicious Hindu Wedding Celebration • Brundavan Gardens, Parigi, Vikarabad Dist.
        </p>
      </footer>

      {/* Lightbox for Divine Blessings Artwork */}
      {isLightboxOpen && (
        <div className="lightbox-modal active" role="dialog">
          <div className="lightbox-backdrop" onClick={() => setIsLightboxOpen(false)}></div>
          <div className="lightbox-content">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="lightbox-close-btn"
              type="button"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="lightbox-image-wrapper">
              <img
                src="/assets/images/divine_blessings.jpg"
                alt="Divine Celestial Blessings"
              />
              <div className="lightbox-caption-bar">
                <div className="lightbox-caption-title">
                  సర్వదేవతా ఆశీర్వచనం (Divine Celestial Blessings)
                </div>
                <div className="lightbox-caption-sub">
                  Supreme Deities Showering Sacred Akshatas & Flowers upon Lahari & Shiva Kumar
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
