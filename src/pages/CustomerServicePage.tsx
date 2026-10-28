import React, { useState, useRef, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  MessageSquare,
  Shield,
  HelpCircle,
  CheckCircle2,
  Send,
  Lock,
  Clock,
  Building2,
  Copy,
  ExternalLink,
  QrCode,
  Sparkles,
} from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const CustomerServicePage: React.FC = () => {
  const { user, setActivePage, supportMessages, sendSupportMessage } = useBanking();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [inputText, setInputText] = useState('');
  const [inputSubject, setInputSubject] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const WHATSAPP_NUMBER_DISPLAY = '+1 (607) 273-2265';
  const WHATSAPP_RAW_NUMBER = '16072732265';
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_RAW_NUMBER}?text=Hello%20Tompkins%20Client%20Care%2C%20this%20is%20Paulina%20Villarreal%20requesting%20assistance.`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [supportMessages]);

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText('+16072732265');
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendSupportMessage(inputText.trim(), inputSubject.trim() || undefined);
    setInputText('');
    setInputSubject('');
  };

  const faqs = [
    {
      q: 'Why is Tompkins Customer Service WhatsApp only?',
      a: 'To guarantee end-to-end encrypted messaging, instant file and clearance receipt exchanges, and 24/7 responsiveness for touring artists and private clients worldwide, Tompkins Client Care operates exclusively via verified WhatsApp. Standard cellular voice calls and SMS are not supported on this line.',
    },
    {
      q: 'How do I start a conversation on WhatsApp?',
      a: `Simply tap the "Open WhatsApp Concierge" button or add our verified number +1 (607) 273-2265 to your WhatsApp contacts. A dedicated Tompkins private wealth officer will connect with you immediately.`,
    },
    {
      q: 'Can I also use the Direct Messages tab in this portal?',
      a: 'Yes. In addition to WhatsApp, you can submit direct messages right here in the portal below. Responses from our bank operations desk will appear in your thread in real time with an in-app alert.',
    },
    {
      q: 'What is Tompkins Community Bank routing number?',
      a: 'Your Tompkins Community Bank routing transit number is 021302564. Your complete account numbers can be retrieved from your My Account overview.',
    },
    {
      q: 'How do I report a misplaced card or emergency wire?',
      a: 'You can instantly freeze your card with one tap in My Account, or message our WhatsApp concierge desk 24/7 for emergency card replacement courier dispatch.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-10 px-4 sm:px-6">
      <div className="max-w-[1240px] mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-full bg-linear-to-l from-[#25D366]/10 to-transparent pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#004732]">
                  Tompkins Private Client Care
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-[#004732] border border-emerald-300 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                  <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
                  WhatsApp Concierge Only
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Customer Service &amp; Support
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Official Tompkins Client Care is provided exclusively via verified WhatsApp. Voice calls and SMS are not accepted. Reach our concierge desk directly below.
              </p>
            </div>

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-md shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Chat on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Top Channels Grid: Dedicated WhatsApp Channel & Security Protection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Channel 1: WhatsApp Channel ONLY */}
          <div className="bg-white p-6 sm:p-7 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
                  <WhatsAppIcon className="w-7 h-7 fill-[#25D366]" />
                </div>
                <span className="px-2.5 py-1 bg-[#25D366]/15 border border-[#25D366]/30 text-[#075E54] text-[11px] font-bold uppercase tracking-wider rounded flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                  WhatsApp Only · Official Desk
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                Official WhatsApp Concierge Desk
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Our client care operates strictly through WhatsApp end-to-end encrypted messaging. Cellular voice phone calls and standard SMS are not supported.
              </p>

              {/* Number Card */}
              <div className="mt-5 p-4 bg-emerald-50/60 rounded-lg border border-emerald-200/80 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#004732] tracking-wider flex items-center gap-1.5">
                    <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                    WhatsApp Business Number
                  </p>
                  <p className="text-xl sm:text-2xl font-mono font-bold text-slate-900 mt-0.5">
                    {WHATSAPP_NUMBER_DISPLAY}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="p-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded transition-colors cursor-pointer"
                    title="Show WhatsApp QR Code"
                  >
                    <QrCode className="w-4 h-4 text-slate-700" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Copy WhatsApp number"
                  >
                    {copiedNumber ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white rounded border border-slate-200 text-xs text-slate-700 space-y-1.5">
                <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  24/7 Verified Private Banking Coverage
                </p>
                <p className="text-[11px] text-slate-600">
                  Message anytime regarding account balances, high-limit wire clearings, card unlocks, and concierge services. Average response time: &lt; 2 minutes.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 text-center shadow-xs"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Open WhatsApp Concierge</span>
              </a>
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-slate-600" />
                <span>Scan QR</span>
              </button>
            </div>
          </div>

          {/* Channel 2: Instant Card Defense & Protection */}
          <div className="bg-white p-6 sm:p-7 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#004732] flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider rounded">
                  24/7 Instant Lock
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                Security &amp; Card Management
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Zero liability guarantee on all transactions. Lock or unlock your Tompkins debit and obsidian credit cards instantly from your account.
              </p>

              <div className="mt-5 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-600">Debit Card (··6110):</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active &amp; Protected
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600">Visa Platinum (··4821):</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active &amp; Protected
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 mt-3">
                Need urgent assistance locking a card? You can also message our WhatsApp desk anytime at <strong className="text-slate-700">+1 (607) 273-2265</strong> for immediate card freeze.
              </p>
            </div>

            <button
              onClick={() => setActivePage('my-account')}
              className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-slate-600" />
              <span>Manage Cards in My Account</span>
            </button>
          </div>

        </div>

        {/* =========================================================================
            CHANNEL 3: INTERACTIVE DIRECT MESSAGING (Responded to at the Bank End)
            ========================================================================= */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#004732] text-white flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-none">
                  Direct Messages with Tompkins Client Care
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Direct encrypted line connected to our bank operations desk. Concierge representatives review and reply here in real time.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-700">Bank Operations Desk Connected</span>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="p-6 space-y-4 max-h-[460px] overflow-y-auto bg-[#FBFDFB]/50 divide-y divide-transparent">
            {supportMessages.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No messages yet. Send a message below to reach the bank desk.
              </div>
            ) : (
              supportMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 text-xs font-bold ${
                        isUser
                          ? 'bg-[#004732] text-white ring-1 ring-[#004732]/30'
                          : 'bg-emerald-100 text-[#004732] border border-emerald-300'
                      }`}
                    >
                      {isUser ? (
                        user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{user.avatarInitials || 'PV'}</span>
                        )
                      ) : (
                        <Building2 className="w-4 h-4" />
                      )}
                    </div>

                    <div
                      className={`rounded-xl p-4 text-xs space-y-1.5 shadow-xs ${
                        isUser
                          ? 'bg-[#004732] text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-[10px] opacity-80 border-b pb-1 mb-1 border-white/20">
                        <span className="font-bold">{isUser ? msg.senderName : 'Tompkins Client Care'}</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {msg.timestamp}
                        </span>
                      </div>

                      {msg.subject && (
                        <p className={`font-semibold text-xs ${isUser ? 'text-emerald-100' : 'text-slate-900'}`}>
                          {msg.subject}
                        </p>
                      )}

                      <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Direct Message Input Form */}
          <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <input
                  type="text"
                  placeholder="Subject / Topic (Optional)..."
                  value={inputSubject}
                  onChange={(e) => setInputSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#004732]"
                />
              </div>
              <div className="sm:col-span-2 relative flex items-center">
                <input
                  type="text"
                  required
                  placeholder="Type your message to the bank operations desk..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full pl-3 pr-24 py-2 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-[#004732]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3 py-1 bg-[#004732] hover:bg-[#003828] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Messages submitted here are received securely by our operations desk. Direct responses from the bank will appear in this thread.
            </p>
          </form>
        </div>

        {/* FAQs */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#004732]" />
            <span>Frequently Asked Questions</span>
          </h2>

          <div className="divide-y divide-slate-100">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left flex justify-between items-center text-sm font-semibold text-slate-900 hover:text-[#004732] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-xs text-slate-400 ml-2">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-slate-50 p-3.5 rounded border border-slate-100">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* WhatsApp QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#25D366]/20 text-[#25D366] mx-auto flex items-center justify-center">
              <WhatsAppIcon className="w-7 h-7 fill-[#25D366]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Tompkins WhatsApp Care</h3>
              <p className="text-xs text-slate-500 mt-1">Scan to start chatting with your concierge</p>
            </div>

            {/* Generated QR Mockup */}
            <div className="p-4 bg-slate-50 border-2 border-dashed border-emerald-300 rounded-lg inline-block mx-auto">
              <div className="w-48 h-48 bg-white p-2 rounded shadow-xs flex flex-col items-center justify-center border border-slate-200">
                <QrCode className="w-36 h-36 text-slate-900" />
                <span className="text-[10px] font-mono font-bold text-[#004732] mt-1">+1 (607) 273-2265</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Open WhatsApp on your mobile phone, tap Settings &gt; QR Code or camera, and scan to launch an instant chat.
            </p>

            <div className="flex gap-2 pt-2">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded transition-colors"
              >
                Open in WhatsApp Web
              </a>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
