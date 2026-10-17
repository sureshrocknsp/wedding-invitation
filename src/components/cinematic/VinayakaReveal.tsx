import React from 'react';

interface VinayakaRevealProps {
  isRevealed: boolean;
}

export const VinayakaReveal: React.FC<VinayakaRevealProps> = ({ isRevealed }) => {
  return (
    <div className={`vinayaka-sanctum-focus ${isRevealed ? 'revealed' : ''}`}>
      {/* Divine Soft Center Spotlight */}
      <div className="vinayaka-spotlight" aria-hidden="true"></div>

      {/* Radiant Divine Halo behind Vinayaka */}
      <div className="vinayaka-radiant-halo" aria-hidden="true"></div>

      {/* Sacred Traditional Brass Diyas (Kuthu Vilakku) */}
      <div className="sanctum-kuthu-vilakku" aria-hidden="true">
        <div className="vilakku-lamp lamp-left">
          <div className="flame-core"></div>
          <div className="flame-ambient-glow"></div>
        </div>
        <div className="vilakku-lamp lamp-right">
          <div className="flame-core"></div>
          <div className="flame-ambient-glow"></div>
        </div>
      </div>

      {/* Sacred Sanskrit Invocation Card */}
      <div className="sacred-invocation-overlay">
        <div className="sacred-om-symbol">శ్రీరస్తు • శుభమస్తు • కళ్యాణమస్తు</div>
        <h3 className="invocation-heading">॥ వివాహ మహోత్సవ ఆహ్వాన శుభ పత్రిక ॥</h3>
        <p className="sanskrit-shloka-lines">
          శ్లో॥ ఆదిత్యాది గ్రహాస్సర్వే స్వనక్షత్ర స్వరాశయః ।<br />
          కుర్వంతు మంగళం తాభ్యాం యయోరుద్వాహ పత్రికా ॥
        </p>
        <p className="shloka-meaning-text">
          "May Aditya and all celestial planetary deities bestow eternal harmony, joy, and supreme auspiciousness upon this sacred wedding union."
        </p>
      </div>
    </div>
  );
};
