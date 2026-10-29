import React, { useState, useRef } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  User,
  Shield,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  CheckCircle2,
  Edit2,
  Save,
  X,
  KeyRound,
  FileText,
  Bell,
  ArrowLeft,
  Briefcase,
  AlertCircle,
  ExternalLink,
  Camera,
  Trash2,
  Upload,
  Sparkles,
} from 'lucide-react';

const ARTIST_PRESETS = [
  {
    id: 'studio',
    name: 'Studio Portrait',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'artist',
    name: 'Artist Headshot',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'creative',
    name: 'Creative Portrait',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
];

export const ProfilePage: React.FC = () => {
  const { user, updateUser, setActivePage } = useBanking();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<'personal' | 'banking' | 'security' | 'preferences'>('personal');

  // Edit Mode State for Personal Details
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address || '118 E Seneca Street, Apt 4B',
    cityStateZip: user.cityStateZip || 'Ithaca, NY 14850',
    occupation: user.occupation || 'Professional Musician & Recording Artist',
  });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Profile Photo Upload & Removal Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateUser({ avatarUrl: result });
        setSaveSuccessMsg('Profile picture updated successfully.');
        setTimeout(() => setSaveSuccessMsg(null), 3000);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    updateUser({ avatarUrl: '' });
    setSaveSuccessMsg('Profile picture removed. Your initials badge is now active.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSelectPreset = (url: string) => {
    updateUser({ avatarUrl: url });
    setSaveSuccessMsg('Profile picture updated with selected photo.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // SSN Privacy Reveal State
  const [showSSN, setShowSSN] = useState(false);

  // Password Change Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Revoke Sessions State
  const [sessionsRevoked, setSessionsRevoked] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    updateUser({
      name: editFormData.name,
      email: editFormData.email,
      phone: editFormData.phone,
      address: editFormData.address,
      cityStateZip: editFormData.cityStateZip,
      occupation: editFormData.occupation,
      avatarInitials: editFormData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    });

    setIsEditing(false);
    setSaveSuccessMsg('Profile information updated successfully.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (!passwordForm.current) {
      setPasswordError('Please enter your current account password.');
      return;
    }
    if (passwordForm.next.length < 8) {
      setPasswordError('New password must contain at least 8 characters.');
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSuccess('Password successfully updated. Security credentials refreshed.');
    setTimeout(() => {
      setPasswordSuccess(null);
      setIsPasswordModalOpen(false);
      setPasswordForm({ current: '', next: '', confirm: '' });
    }, 1500);
  };

  const handleRevokeOtherSessions = () => {
    setSessionsRevoked(true);
    setTimeout(() => setSessionsRevoked(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] py-8 px-4 sm:px-6">
      <div className="max-w-[1140px] mx-auto space-y-6">

        {/* Top Breadcrumb & Return Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => setActivePage('my-account')}
              className="text-[#004732] hover:underline font-medium flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Accounts</span>
            </button>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Profile &amp; Settings</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Member ID:</span>
            <span className="text-xs font-mono font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
              TPK-6110634-PV
            </span>
          </div>
        </div>

        {/* Global Save Feedback Toast */}
        {saveSuccessMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs font-medium flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* User Hero Banner */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative group shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-600 shadow-sm bg-[#003828] flex items-center justify-center">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-xl tracking-wider">
                    {user.avatarInitials || 'PV'}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1 bg-[#004732] hover:bg-[#003828] text-white rounded-full shadow border-2 border-white transition-transform hover:scale-110 cursor-pointer"
                title="Change profile picture"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-[#004732] border border-emerald-200">
                  {user.tier}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Tompkins Client
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Member since {user.memberSince}</span>
                <span>·</span>
                <span>Branch: {user.primaryBranch || 'Tompkins Bank & Trust - Ithaca Main Office'}</span>
                <span>·</span>
                <span>Advisor: {user.privateBanker || 'Sarah Jenkins'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => {
                setIsEditing(true);
                setActiveTab('personal');
              }}
              className="px-4 py-2 bg-[#004732] hover:bg-[#005AB5] text-white text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#004732]" />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-lg px-6 pt-2">
          <nav className="flex space-x-6">
            {[
              { id: 'personal', label: 'Personal Information', icon: User },
              { id: 'banking', label: 'Private Banking & Branch', icon: Building2 },
              { id: 'security', label: 'Security & Logins', icon: Shield },
              { id: 'preferences', label: 'Preferences & Alerts', icon: Bell },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'border-[#004732] text-[#004732]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#004732]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab 1: Personal Information */}
        {activeTab === 'personal' && (
          <div className="bg-white rounded-b-lg border border-t-0 border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Personal &amp; Contact Details</h2>
                <p className="text-xs text-slate-500">Legal identity, official address, and verified communication channels</p>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#004732]" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel Editing</span>
                </button>
              )}
            </div>

            {/* Hidden File Input for Picture Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Dedicated Profile Picture Manager */}
            <div className="p-4 sm:p-5 bg-slate-50/70 border border-slate-200 rounded-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-300 shadow-xs bg-[#003828] flex items-center justify-center shrink-0">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-xl tracking-wider">
                        {user.avatarInitials || 'PV'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Account Profile Picture
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {user.avatarUrl
                        ? 'Custom photo active across your banking dashboard.'
                        : 'Official initials badge currently active.'}
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {user.avatarUrl ? 'Photo Active' : 'Initials Badge Active'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  {/* Change/Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-[#004732] hover:bg-[#003828] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change Picture</span>
                  </button>

                  {/* Remove Button */}
                  {Boolean(user.avatarUrl) && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3 py-2 bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-slate-700 hover:text-rose-700 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Remove profile picture"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Picture</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Preset Quick-Picks */}
              <div className="pt-3 border-t border-slate-200/80">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Or choose a preset artist portrait:
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  {ARTIST_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className={`flex items-center gap-2 p-1.5 rounded-md border text-left transition-all cursor-pointer ${
                        user.avatarUrl === preset.url
                          ? 'border-[#004732] bg-emerald-50/70 ring-1 ring-[#004732]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <span className="text-[11px] font-medium text-slate-700 pr-1">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-2xl text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-[#004732]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Occupation / Title</label>
                    <input
                      type="text"
                      value={editFormData.occupation}
                      onChange={(e) => setEditFormData({ ...editFormData, occupation: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-[#004732]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-[#004732]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Primary Phone Number</label>
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-[#004732]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Residential Street Address</label>
                  <input
                    type="text"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-[#004732]"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">City, State, ZIP Code</label>
                  <input
                    type="text"
                    value={editFormData.cityStateZip}
                    onChange={(e) => setEditFormData({ ...editFormData, cityStateZip: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-[#004732]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#004732] hover:bg-[#005AB5] text-white font-semibold rounded transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Column 1 */}
                <div className="space-y-4">
                  <div className="bg-slate-50/70 p-4 rounded border border-slate-200/80">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Legal Full Name</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{user.name}</p>
                  </div>

                  <div className="bg-slate-50/70 p-4 rounded border border-slate-200/80">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Date of Birth</span>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{user.dateOfBirth || 'February 5, 2002'}</span>
                    </p>
                  </div>

                  <div className="bg-slate-50/70 p-4 rounded border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Taxpayer ID / SSN</span>
                      <button
                        onClick={() => setShowSSN(!showSSN)}
                        className="text-[#004732] hover:underline flex items-center gap-1 text-[11px] font-semibold"
                      >
                        {showSSN ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showSSN ? 'Hide' : 'Reveal'}</span>
                      </button>
                    </div>
                    <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                      {showSSN ? '624-91-4821' : (user.ssnMasked || '•••-••-4821')}
                    </p>
                  </div>

                  <div className="bg-slate-50/70 p-4 rounded border border-slate-200/80">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Occupation &amp; Professional Role</span>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      <span>{user.occupation || 'Principal Architect & Managing Partner'}</span>
                    </p>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <div className="bg-slate-50/70 p-4 rounded border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Email Address</span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>{user.email}</span>
                    </p>
                  </div>

                  <div className="bg-slate-50/70 p-4 rounded border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Primary Phone</span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        2FA Active
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{user.phone}</span>
                    </p>
                  </div>

                  <div className="bg-slate-50/70 p-4 rounded border border-slate-200/80">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Residential Address</span>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <span>
                        {user.address || '742 Montgomery Street, Penthouse 18B'}<br />
                        {user.cityStateZip || 'San Francisco, CA 94111'}
                      </span>
                    </p>
                  </div>

                  <div className="bg-slate-50/70 p-4 rounded border border-slate-200/80">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Mailing Address</span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Same as residential street address on file.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Private Banking & Branch Relationship */}
        {activeTab === 'banking' && (
          <div className="bg-white rounded-b-lg border border-t-0 border-slate-200 shadow-xs p-6 space-y-6 text-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Private Client Relationship &amp; Assigned Branch</h2>
              <p className="text-slate-500">Your dedicated wealth officers, physical branch hub, and personalized institutional limits</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Private Banker Card */}
              <div className="border border-slate-200 rounded-lg p-5 space-y-4 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#004732] text-white flex items-center justify-center font-bold text-sm">
                    SJ
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#004732] uppercase tracking-wider">Dedicated Private Banker</span>
                    <h3 className="text-sm font-bold text-slate-900">{user.privateBanker || 'Sarah Jenkins'}</h3>
                    <p className="text-[11px] text-slate-500">{user.privateBankerTitle || 'Customer Care & Digital Banking Officer'}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200 text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> WhatsApp Concierge:
                    </span>
                    <a
                      href="https://wa.me/16072732265"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#004732] hover:underline"
                    >
                      {user.privateBankerPhone || 'WhatsApp Only: +1 (607) 273-2265'}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> Secure Email:
                    </span>
                    <span className="font-semibold text-[#004732]">{user.privateBankerEmail || 'customercare@tompkinsbank.com'}</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-[11px]">
                  Direct priority routing: Sarah Jenkins is authorized to execute complex corporate wires, tour disbursements, and concierge requests via verified WhatsApp on your behalf.
                </div>
              </div>

              {/* Physical Branch Details */}
              <div className="border border-slate-200 rounded-lg p-5 space-y-4 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-slate-900 text-white flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#004732]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Primary Branch Hub</span>
                    <h3 className="text-sm font-bold text-slate-900">{user.primaryBranch || 'San Francisco Financial District'}</h3>
                    <p className="text-[11px] text-slate-500">Transit Routing: 021000089 · Branch Code: 8941</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200 text-slate-700">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500 flex items-center gap-1.5 shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Address:
                    </span>
                    <span className="font-semibold text-right">{user.branchAddress || '555 California Street, Suite 2100, San Francisco, CA 94104'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Private Salon Hours:</span>
                    <span className="font-semibold">Mon–Fri: 8:00 AM – 6:00 PM PST</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-100 border border-slate-200 rounded text-slate-700 text-[11px]">
                  Complimentary valet parking and secure boardroom access available for private client appointments.
                </div>
              </div>
            </div>

            {/* Privileges & Institutional Limits */}
            <div className="border border-slate-200 rounded-lg p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Accredited Tier Privileges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Daily Wire Clearance</span>
                  <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">$250,000.00</span>
                  <span className="text-[10px] text-emerald-600 font-medium">FedWire &amp; FedNow Enabled</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Daily ATM Cash Withdrawal</span>
                  <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">$2,500.00</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Worldwide Surcharge Reimbursed</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Mobile Deposit Limit</span>
                  <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">$50,000.00</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Instant Verification</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Logins */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-b-lg border border-t-0 border-slate-200 shadow-xs p-6 space-y-6 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Security Credentials &amp; Access Controls</h2>
                <p className="text-slate-500">Manage multifactor authentication, biometric credentials, and authorized devices</p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs font-semibold self-start sm:self-auto">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Security Health: 98% (Optimal)</span>
              </div>
            </div>

            {/* Credentials Row */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded border border-slate-200 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-[#004732]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Account Password</h4>
                    <p className="text-slate-500">Last updated 42 days ago · Never share your credentials</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold rounded transition-colors self-start sm:self-auto"
                >
                  Change Password
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded border border-slate-200 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
                    <p className="text-slate-500">Authenticator app &amp; SMS verification for wire transfers and logins</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Active &amp; Enforced
                  </span>
                  <button
                    onClick={() => {
                      updateUser({ twoFactorEnabled: !user.twoFactorEnabled });
                      setSaveSuccessMsg(`Two-factor authentication ${user.twoFactorEnabled ? 'disabled' : 'enabled'}.`);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold rounded text-xs"
                  >
                    Configure
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded border border-slate-200 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-[#004732]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Biometric Recognition &amp; WebAuthn</h4>
                    <p className="text-slate-500">TouchID, FaceID, or hardware security keys enabled for swift authorization</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded self-start sm:self-auto">
                  Enabled (FIDO2 Certified)
                </span>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Active Logged-In Sessions</h3>
                  <p className="text-slate-500 text-xs">Devices currently authenticated to your Apex Online Banking profile</p>
                </div>
                <button
                  onClick={handleRevokeOtherSessions}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold rounded text-xs transition-colors"
                >
                  Revoke Other Sessions
                </button>
              </div>

              {sessionsRevoked && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All secondary sessions have been revoked. Only this browser remains active.</span>
                </div>
              )}

              <div className="border border-slate-200 rounded divide-y divide-slate-100">
                <div className="p-3 flex items-center justify-between bg-white">
                  <div>
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      <span>Chrome 131 on macOS (Apple Silicon)</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                        This Session
                      </span>
                    </p>
                    <p className="text-slate-500 text-[11px]">San Francisco, CA, USA · IP 192.0.2.45 · Active right now</p>
                  </div>
                </div>
                {!sessionsRevoked && (
                  <div className="p-3 flex items-center justify-between bg-white">
                    <div>
                      <p className="font-bold text-slate-900">iPhone 15 Pro · Apex Bank Mobile App v4.8</p>
                      <p className="text-slate-500 text-[11px]">San Francisco, CA, USA · Last active 2 hours ago via TouchID</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Preferences & Alerts */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-b-lg border border-t-0 border-slate-200 shadow-xs p-6 space-y-6 text-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Account Preferences &amp; Notification Rules</h2>
              <p className="text-slate-500">Configure paperless electronic delivery and real-time transaction alerts</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Paperless Statements &amp; Tax Documents</h4>
                  <p className="text-slate-500">Receive encrypted PDF statements and IRS 1099-INT electronically instead of physical mail</p>
                </div>
                <input
                  type="checkbox"
                  checked={user.paperlessStatements !== false}
                  onChange={(e) => {
                    updateUser({ paperlessStatements: e.target.checked });
                    setSaveSuccessMsg(`Paperless statement delivery ${e.target.checked ? 'enabled' : 'disabled'}.`);
                  }}
                  className="w-4 h-4 text-[#004732] rounded accent-[#004732] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Real-Time SMS &amp; Push Transaction Alerts</h4>
                  <p className="text-slate-500">Immediate SMS notification to {user.phone} for any debit or credit exceeding $100</p>
                </div>
                <input
                  type="checkbox"
                  checked={user.transactionAlerts !== false}
                  onChange={(e) => {
                    updateUser({ transactionAlerts: e.target.checked });
                    setSaveSuccessMsg(`Transaction alerts ${e.target.checked ? 'enabled' : 'disabled'}.`);
                  }}
                  className="w-4 h-4 text-[#004732] rounded accent-[#004732] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Domestic &amp; International Wire Hold Notifications</h4>
                  <p className="text-slate-500">Notify immediately when outgoing wires enter administrative clearance review</p>
                </div>
                <input
                  type="checkbox"
                  checked={user.wireAlerts !== false}
                  onChange={(e) => {
                    updateUser({ wireAlerts: e.target.checked });
                    setSaveSuccessMsg(`Wire review alerts ${e.target.checked ? 'enabled' : 'disabled'}.`);
                  }}
                  className="w-4 h-4 text-[#004732] rounded accent-[#004732] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Change Online Banking Password</h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  required
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-[#004732]"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">New Password (minimum 8 characters)</label>
                <input
                  type="password"
                  value={passwordForm.next}
                  onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                  required
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-[#004732]"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  required
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-[#004732]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded bg-[#004732] hover:bg-[#005AB5] text-white font-semibold"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
