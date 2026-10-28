import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Lock,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Trash2,
} from 'lucide-react';

export const SecuritySettingsView: React.FC = () => {
  const { user, resetAllData, toggleCardFreeze, cards } = useBanking();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'sess_1',
      device: 'MacBook Pro 16" · Chrome 132',
      location: 'San Francisco, CA (Current Session)',
      ip: '198.51.100.24',
      active: true,
    },
    {
      id: 'sess_2',
      device: 'iPhone 16 Pro Max · Apex iOS App',
      location: 'San Francisco, CA',
      ip: '198.51.100.89',
      active: false,
    },
    {
      id: 'sess_3',
      device: 'iPad Pro 13" · Safari Mobile',
      location: 'Palo Alto, CA',
      ip: '203.0.113.12',
      active: false,
    },
  ]);

  // Fraud Alert Simulation State
  const [simulatedAlert, setSimulatedAlert] = useState<{
    merchant: string;
    amount: number;
    location: string;
    resolved?: boolean;
    statusText?: string;
  } | null>(null);

  const handleSimulateFraud = () => {
    setSimulatedAlert({
      merchant: 'Moncler Flagship Boutique',
      amount: 1450.00,
      location: 'Milan, Italy · Unrecognized Device',
    });
  };

  const handleResolveFraud = (approved: boolean) => {
    if (approved) {
      setSimulatedAlert({
        merchant: 'Moncler Flagship Boutique',
        amount: 1450.00,
        location: 'Milan, Italy',
        resolved: true,
        statusText: 'Approved: Transaction permitted and merchant added to verified registry.',
      });
    } else {
      // Freeze obsidian card
      if (cards[0]) toggleCardFreeze(cards[0].id);
      setSimulatedAlert({
        merchant: 'Moncler Flagship Boutique',
        amount: 1450.00,
        location: 'Milan, Italy',
        resolved: true,
        statusText: 'Blocked: Unauthorized charge prevented. Obsidian card locked for protection.',
      });
    }
  };

  const handleRevokeSessions = () => {
    setActiveSessions((prev) => prev.filter((s) => s.active));
    alert('All external remote device sessions have been revoked.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Security Shield & Vault Cryptography
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Hardware 2FA enforcement, device session tokens, and automated fraud defense.
        </p>
      </div>

      {/* Security Credentials */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Authentication Standards</span>
        </h2>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Multi-Factor Authentication (MFA / 2FA)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Requires hardware security key or authenticator app prompt on unknown logins.
              </p>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                twoFactorEnabled
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {twoFactorEnabled ? 'Enforced' : 'Disabled'}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <KeyRound className="w-4 h-4 text-blue-400" />
                <span>WebAuthn Biometric FaceID & TouchID</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Passwordless passkeys backed by device secure enclave.
              </p>
            </div>
            <button
              onClick={() => setBiometricsEnabled(!biometricsEnabled)}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                biometricsEnabled
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {biometricsEnabled ? 'Active' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Fraud Simulation Sandbox */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-bold text-white">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Interactive Real-Time Fraud Alert Simulator</span>
          </div>
          <button
            onClick={handleSimulateFraud}
            className="py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-semibold text-amber-400 transition-colors"
          >
            Trigger Test Alert
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Simulate how Apex Bank instantly detects unusual geographic or merchant spending patterns and alerts the account holder.
        </p>

        {simulatedAlert && (
          <div className="p-5 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Suspicious Transaction Intercept
                </span>
                <p className="text-base font-bold text-white mt-1">{simulatedAlert.merchant}</p>
                <p className="text-xs text-slate-300">{simulatedAlert.location}</p>
              </div>
              <p className="text-lg font-bold font-mono text-amber-300 tabular-nums">
                ${simulatedAlert.amount.toFixed(2)}
              </p>
            </div>

            {simulatedAlert.resolved ? (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{simulatedAlert.statusText}</span>
              </div>
            ) : (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleResolveFraud(true)}
                  className="flex-1 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-semibold text-white transition-colors"
                >
                  Yes, I Authorized This
                </button>
                <button
                  onClick={() => handleResolveFraud(false)}
                  className="flex-1 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-xs font-bold text-white transition-colors"
                >
                  No, Decline & Lock Card
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Device Sessions */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Active Device Sessions</h2>
          <button
            onClick={handleRevokeSessions}
            className="text-xs text-rose-400 hover:underline"
          >
            Revoke All Other Sessions
          </button>
        </div>

        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono"
            >
              <div>
                <p className="font-bold text-white font-sans">{session.device}</p>
                <p className="text-slate-400 text-[11px] mt-0.5">{session.location} · IP: {session.ip}</p>
              </div>
              {session.active ? (
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                  Current
                </span>
              ) : (
                <span className="text-[10px] text-slate-500">Authorized</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Demo Reset Console */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset Demo Banking Sandbox</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Restore initial balance sheet ($67,000+ assets), transactions, and payees to pristine defaults.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset all accounts and data back to initial demo state?')) {
              resetAllData();
              alert('Apex Bank sandbox restored to initial state.');
            }
          }}
          className="self-start sm:self-auto py-2 px-4 rounded-xl bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-xs font-semibold text-slate-300 hover:text-rose-400 transition-colors"
        >
          Reset Demo Data
        </button>
      </div>

    </div>
  );
};
