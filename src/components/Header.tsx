import { RefreshCw, Sparkles, Map, ShieldCheck, AlertCircle, Calendar } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';

interface HeaderProps {
  activeTab: 'SCHEDULE' | 'INSTAGRAM';
  onTabChange: (tab: 'SCHEDULE' | 'INSTAGRAM') => void;
  lastUpdated: string;
  isLive: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenStadiumGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  lastUpdated,
  isLive,
  isLoading,
  onRefresh,
  onOpenStadiumGuide
}) => {
  return (
    <header className="sticky top-0 z-30 glass-nav border-b border-pink-100 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rkg-crimson to-rkg-pink-deep p-0.5 shadow-pink-glow flex items-center justify-center text-white font-black text-sm tracking-wider">
            RKG
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight flex items-center gap-1">
                <span>樂天女孩上班班表</span>
                <Sparkles className="w-4 h-4 text-rkg-pink fill-rkg-pink animate-pulse" />
              </h1>
              {/* Year Badge updated to 2026 */}
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pink-100 text-rkg-crimson border border-pink-200">
                2026
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Rakuten Girls Live Schedule • 即時場次與東／西區／假日特別席位站位
            </p>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-pink-50/80 p-1 rounded-2xl border border-pink-200/60">
          <button
            onClick={() => onTabChange('SCHEDULE')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'SCHEDULE'
                ? 'bg-gradient-to-r from-rkg-pink-deep to-rkg-crimson text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>即時班表</span>
          </button>

          <button
            onClick={() => onTabChange('INSTAGRAM')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'INSTAGRAM'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-purple-900 hover:bg-white/60'
            }`}
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>成員 IG</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Stadium Guide Button */}
          <button
            onClick={onOpenStadiumGuide}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-pink-50 text-gray-700 border border-pink-200 shadow-sm transition active:scale-95"
          >
            <Map className="w-3.5 h-3.5 text-rkg-crimson" />
            <span>球場席位</span>
          </button>

          {/* Sync Status Badge & Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-sm active:scale-95 ${
              isLoading
                ? 'bg-pink-100 text-pink-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-rkg-pink-deep to-rkg-crimson hover:from-rkg-pink hover:to-rkg-pink-deep text-white shadow-pink-glow'
            }`}
            title="從 Google 試算表拉取最新排班"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isLoading ? '同步中...' : '同步最新班表'}
            </span>
          </button>
        </div>
      </div>

      {/* Sync Status Micro Bar */}
      <div className="bg-pink-50/60 border-t border-pink-100/60 px-4 py-1 text-[11px] text-gray-500">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLive ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Google 試算表即時連線中</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>離線／備用快照模式</span>
              </span>
            )}
            <span className="text-gray-300">|</span>
            <span>更新時間：{lastUpdated}</span>
          </div>

          <button
            onClick={onOpenStadiumGuide}
            className="md:hidden text-rkg-crimson font-semibold hover:underline flex items-center gap-1"
          >
            <Map className="w-3 h-3" />
            <span>球場席位說明</span>
          </button>
        </div>
      </div>
    </header>
  );
};
