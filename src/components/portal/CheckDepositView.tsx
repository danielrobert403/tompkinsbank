import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  Camera,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  Upload,
  ArrowRight,
  Info,
  RotateCcw,
} from 'lucide-react';
import { CheckDepositRequest } from '../../types/banking';

export const CheckDepositView: React.FC = () => {
  const { accounts, depositCheck, formatCurrency } = useBanking();

  const [accountId, setAccountId] = useState<string>(accounts[0]?.id || '');
  const [amount, setAmount] = useState<string>('750.00');
  const [checkNumber, setCheckNumber] = useState<string>('4829');
  const [notes, setNotes] = useState<string>('Consulting Honorarium');

  const [frontCaptured, setFrontCaptured] = useState(true);
  const [backCaptured, setBackCaptured] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<{
    success: boolean;
    message: string;
    txId?: string;
    amount: number;
    accountName: string;
    date: string;
  } | null>(null);

  const selectedAccount = accounts.find((a) => a.id === accountId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid check amount.');
      return;
    }

    if (!frontCaptured || !backCaptured) {
      alert('Please capture both front and back images of the endorsed check.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const request: CheckDepositRequest = {
        accountId,
        amount: numAmount,
        checkNumber,
        notes,
      };

      const result = depositCheck(request);
      setIsProcessing(false);

      if (result.success) {
        setReceipt({
          success: true,
          message: result.message,
          txId: result.transactionId,
          amount: numAmount,
          accountName: selectedAccount?.name || 'Apex Checking',
          date: new Date().toLocaleString(),
        });
      }
    }, 1000);
  };

  const handleReset = () => {
    setReceipt(null);
    setAmount('500.00');
    setCheckNumber(String(Math.floor(1000 + Math.random() * 9000)));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Mobile Remote Check Deposit
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Deposit physical checks directly into your account with instant image clearance up to $50,000.
        </p>
      </div>

      {!receipt ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Account & Check Metadata */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Step 1: Check Details & Destination</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Deposit To Account</label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-400"
                >
                  {accounts
                    .filter((a) => a.type !== 'credit')
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} (··{acc.accountNumber.slice(-4)})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Check Number</label>
                <input
                  type="text"
                  placeholder="e.g. 4829"
                  value={checkNumber}
                  onChange={(e) => setCheckNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Check Exact Amount ($ USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-base">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1.00"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-base font-bold font-mono text-white focus:outline-none focus:border-emerald-400 tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Memo / Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Consulting Invoice #102, Tax Refund"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Interactive Check Scanner Simulation */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Step 2: Interactive Check Photography</span>
              </h2>
              <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                OCR Auto-Framing Active
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Ensure check is placed on a flat, dark surface with even lighting. Back of check must be endorsed with:
              <strong className="text-white ml-1">&quot;For Apex Mobile Deposit Only&quot;</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Front Check Reticle */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Front of Check</span>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {frontCaptured ? 'Alignment Verified' : 'Awaiting Capture'}
                  </span>
                </div>

                <div
                  onClick={() => setFrontCaptured(!frontCaptured)}
                  className="h-44 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/60 p-4 relative cursor-pointer hover:border-emerald-500 transition-colors flex flex-col justify-between overflow-hidden group"
                >
                  {frontCaptured ? (
                    <div className="h-full flex flex-col justify-between font-mono text-[11px] text-slate-300 p-2 bg-slate-900/90 rounded border border-slate-800">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>PNC FINANCIAL CORP</span>
                        <span>CHECK #{checkNumber || '4829'}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400 text-[9px]">PAY TO THE ORDER OF:</p>
                        <p className="font-bold text-white text-xs">SARAH M. VANCE</p>
                        <p className="text-emerald-400 font-bold text-sm tabular-nums">
                          ${parseFloat(amount || '0').toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="text-[9px] text-slate-400 tracking-widest pt-1 border-t border-slate-800">
                        ⑆021000089⑆ 4821903421⑈ {checkNumber}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                      <Camera className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                      <span className="text-xs">Click to Capture Front</span>
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2">
                    <span className="text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded">
                      Tap to toggle
                    </span>
                  </div>
                </div>
              </div>

              {/* Back Check Reticle */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Back of Check (Endorsement)</span>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {backCaptured ? 'Endorsement Detected' : 'Awaiting Capture'}
                  </span>
                </div>

                <div
                  onClick={() => setBackCaptured(!backCaptured)}
                  className="h-44 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/60 p-4 relative cursor-pointer hover:border-emerald-500 transition-colors flex flex-col justify-between overflow-hidden group"
                >
                  {backCaptured ? (
                    <div className="h-full flex flex-col justify-between font-mono text-[11px] text-slate-300 p-2 bg-slate-900/90 rounded border border-slate-800">
                      <div className="text-[9px] text-slate-400 uppercase">
                        DO NOT WRITE BELOW THIS LINE
                      </div>
                      <div className="space-y-1 my-auto">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Endorsed: Sarah M. Vance</span>
                        </div>
                        <p className="text-[10px] text-slate-400 italic">
                          &quot;For Apex Mobile Deposit Only&quot;
                        </p>
                      </div>
                      <div className="text-[8px] text-slate-500">
                        RESERVED FOR FINANCIAL INSTITUTION ENDORSEMENT
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                      <Camera className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                      <span className="text-xs">Click to Capture Back</span>
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2">
                    <span className="text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded">
                      Tap to toggle
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Funds are credited instantly to your available balance upon verification. Keep physical check in a safe place for 14 days before shredding.
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Verifying MICR & Magnetic Ink...</span>
              ) : (
                <>
                  <span>Submit Check Deposit</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>
      ) : (
        /* Printable / Formal Confirmation Screen */
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto space-y-6 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Deposit Cleared & Credited</h2>
            <p className="text-xs text-slate-400 mt-1">
              Your mobile remote deposit has completed optical verification and is immediately available.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left text-xs space-y-2.5 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Deposit Amount:</span>
              <span className="text-emerald-400 font-bold text-sm tabular-nums">
                {formatCurrency(receipt.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Credited Account:</span>
              <span className="text-white">{receipt.accountName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Check Number:</span>
              <span className="text-white">#{checkNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Confirmation Code:</span>
              <span className="text-emerald-300">APX-{receipt.txId?.slice(-6) || '849201'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Timestamp:</span>
              <span className="text-slate-300">{receipt.date}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-white transition-colors"
            >
              Print Record
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Deposit Another Check</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
