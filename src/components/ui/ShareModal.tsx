import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { WeddingData } from '../../data/weddingData';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WeddingData;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'share' | 'qr'>('share');

  // Determine current effective public URL
  const configuredPublicUrl = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_PUBLIC_URL;
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const isLocalhost = currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1');
  
  const effectivePublicUrl = configuredPublicUrl
    ? configuredPublicUrl.replace(/\/+$/, '')
    : isLocalhost
    ? null
    : typeof window !== 'undefined'
    ? window.location.href.split('#')[0]
    : null;

  const displayShareUrl = effectivePublicUrl || (typeof window !== 'undefined' ? window.location.href.split('#')[0] : '');

  // Pre-composed WhatsApp and text share message
  const whatsappMessage =
    `🌸 *Wedding Invitation | వివాహ ఆహ్వాన శుభ పత్రిక* 🌸\n\n` +
    `We cordially invite you and your family to celebrate the auspicious marriage ceremony & Sumuhurtham of *${data.couple.bride.fullName}* and *${data.couple.groom.fullName}*.\n\n` +
    `📅 *Date*: ${data.weddingDateFormatted}\n` +
    `⏰ *Sumuhurtham*: ${data.muhurthamTime} (${data.weddingDateTelugu})\n` +
    `🏛️ *Venue*: ${data.venue.name}, ${data.venue.address}, ${data.venue.city}\n\n` +
    `✨ *View Digital Invitation & Details*:\n${displayShareUrl}`;

  // Generate QR code whenever modal opens with a valid public URL
  useEffect(() => {
    if (!isOpen || !effectivePublicUrl) {
      setQrDataUrl(null);
      return;
    }

    QRCode.toDataURL(effectivePublicUrl, {
      errorCorrectionLevel: 'H',
      margin: 3,
      width: 480,
      color: {
        dark: '#26080D',
        light: '#FFF8EC'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.warn('QR code generation notice:', err));
  }, [isOpen, effectivePublicUrl]);

  // Keyboard accessibility: Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(displayShareUrl);
      } else {
        const input = document.createElement('input');
        input.value = displayShareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    } catch {
      setCopied(false);
    }
  };

  const handleWhatsAppClick = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.socialSharing?.ogTitle || `${data.couple.bride.name} & ${data.couple.groom.name} — Wedding Invitation`,
          text: data.socialSharing?.shareTextEnglish || whatsappMessage,
          url: displayShareUrl
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="share-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Share Wedding Invitation">
      <div className="share-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="share-modal-header">
          <div className="share-modal-title-wrap">
            <span className="share-modal-shloka">॥ శ్రీరస్తు • శుభమస్తు ॥</span>
            <h3 className="share-modal-title gold-shimmer-text">Share Wedding Invitation</h3>
            <p className="share-modal-sub">
              {data.couple.bride.name} & {data.couple.groom.name} — వివాహ ఆహ్వాన శుభ పత్రిక
            </p>
          </div>
          <button type="button" className="share-modal-close" onClick={onClose} aria-label="Close share dialog">
            &times;
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="share-modal-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'share'}
            className={`share-tab-btn ${activeTab === 'share' ? 'active' : ''}`}
            onClick={() => setActiveTab('share')}
          >
            <span>💌 Share Invitation</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'qr'}
            className={`share-tab-btn ${activeTab === 'qr' ? 'active' : ''}`}
            onClick={() => setActiveTab('qr')}
          >
            <span>📱 Invitation QR Code</span>
          </button>
        </div>

        {/* Tab 1: Share Options */}
        {activeTab === 'share' && (
          <div className="share-tab-content">
            {/* 1. Direct WhatsApp Share Button */}
            <button
              type="button"
              className="whatsapp-share-btn"
              onClick={handleWhatsAppClick}
              title="Share Wedding Invitation directly on WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.15c-.24.68-1.4 1.25-1.92 1.33-.5.08-1.15.11-1.85-.11-.42-.14-.97-.31-1.68-.62-2.96-1.28-4.88-4.29-5.03-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.76-2.18 1.03-2.48.27-.3.59-.38.79-.38.2 0 .4.01.57.02.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.39-.45.53-.15.15-.3.31-.13.61.17.3.77 1.27 1.66 2.06 1.14 1.02 2.1 1.33 2.4 1.48.3.15.47.13.65-.08.18-.2.76-.89.96-1.19.2-.3.4-.25.68-.15.28.1 1.77.83 2.07.98.3.15.5.23.57.35.07.13.07.73-.17 1.41z" />
              </svg>
              <span>Share on WhatsApp (వాట్సాప్ ద్వారా ఆహ్వానం)</span>
            </button>

            {/* 2. Copy Link Box */}
            <div className="share-link-box">
              <input
                type="text"
                readOnly
                value={displayShareUrl}
                className="share-link-input"
                aria-label="Invitation URL"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="share-copy-btn"
                title="Copy wedding invitation URL to clipboard"
              >
                <span>{copied ? '✓ Copied!' : 'Copy Link'}</span>
              </button>
            </div>
            {copied && (
              <p className="share-toast-inline" role="status">
                ✨ Invitation link copied to clipboard! Ready to share with family & friends.
              </p>
            )}

            {/* 3. Native Share / More Apps */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                className="secondary-btn share-native-btn"
                onClick={handleNativeShare}
              >
                <span>📲 More Sharing Options (Messages, Mail, etc.)</span>
              </button>
            )}

            <div className="share-preview-details">
              <span className="preview-label">Auspicious Wedding Sumuhurtham:</span>
              <p className="preview-info">
                <strong>{data.weddingDateFormatted} at {data.muhurthamTime}</strong><br />
                {data.venue.name}, {data.venue.city}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: QR Code Card */}
        {activeTab === 'qr' && (
          <div className="share-tab-content qr-tab-content">
            {effectivePublicUrl && qrDataUrl ? (
              <div className="qr-display-card">
                <div className="qr-ornament-frame">
                  <div className="qr-code-image-wrap">
                    <img
                      src={qrDataUrl}
                      alt={`QR Code to open ${data.couple.bride.name} & ${data.couple.groom.name} Wedding Invitation`}
                      className="qr-code-img"
                    />
                  </div>
                </div>
                <div className="qr-instructions">
                  <h4 className="qr-title gold-text">Scan to Open Wedding Invitation</h4>
                  <p className="qr-desc">
                    Point your mobile camera at this QR code to instantly open the digital wedding invitation card.
                  </p>
                  <p className="qr-url-text">{effectivePublicUrl}</p>
                </div>
                <div className="qr-actions-row">
                  <a
                    href={qrDataUrl}
                    download="wedding_invitation_qr_code.png"
                    className="primary-btn qr-download-btn"
                  >
                    <span>📥 Download QR Code for Print</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="qr-pending-notice">
                <div className="qr-pending-icon">🪔</div>
                <h4 className="qr-pending-title gold-text">Production QR Code Ready</h4>
                <p className="qr-pending-desc">
                  To ensure that printed QR codes on physical cards work reliably for all guests on any mobile network, QR codes are only generated for live production addresses.
                </p>
                <div className="qr-pending-box">
                  <strong>How to activate:</strong>
                  <ol>
                    <li>Deploy the website to your production hosting (Vercel, Netlify, or custom domain).</li>
                    <li>Set <code>VITE_PUBLIC_URL=https://your-domain.com</code> in your environment or open the deployed live URL.</li>
                    <li>Or run the included CLI generator: <code>node scripts/generate-qr.js &lt;YOUR_URL&gt;</code> to create high-resolution print assets.</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
