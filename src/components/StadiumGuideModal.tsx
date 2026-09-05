import React from 'react';
import { X, Map, Compass, CheckCircle2 } from 'lucide-react';

interface StadiumGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StadiumGuideModal: React.FC<StadiumGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-pink-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-pink-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-pink-50 text-rkg-crimson">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  樂天桃園棒球場 • 啦啦隊應援席位導覽
                </h3>
                <p className="text-xs text-gray-500">
                  Taoyuan Baseball Stadium Cheerleading Zones
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stadium Layout Diagram */}
          <div className="my-5 p-4 bg-gradient-to-b from-gray-50 to-pink-50/40 rounded-2xl border border-pink-100/80">
            <div className="text-center font-bold text-xs text-gray-500 mb-3 tracking-wider">
              外野方向 (OUTFIELD)
            </div>

            {/* Stadium Representation Box */}
            <div className="relative border-2 border-dashed border-pink-200 rounded-2xl p-4 bg-white shadow-inner">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* West Wing */}
                <div className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 text-emerald-800 font-extrabold text-sm mb-1">
                    <Compass className="w-4 h-4" />
                    <span>西區應援席</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold">三壘側看台</div>
                  <div className="text-[10px] text-emerald-600 mt-1">內野西下 A ~ G 區</div>
                </div>

                {/* East Wing */}
                <div className="p-3 bg-blue-50 border-2 border-blue-300 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-800 font-extrabold text-sm mb-1">
                    <Compass className="w-4 h-4" />
                    <span>東區應援席</span>
                  </div>
                  <div className="text-[11px] text-blue-700 font-semibold">一壘側看台</div>
                  <div className="text-[10px] text-blue-600 mt-1">內野東下 A ~ G 區</div>
                </div>
              </div>

              {/* Diamond & Home Plate */}
              <div className="w-16 h-16 mx-auto border-2 border-amber-300 rotate-45 flex items-center justify-center bg-amber-50/50 mb-2">
                <span className="text-[10px] font-bold text-amber-800 -rotate-45">內野</span>
              </div>
              <div className="text-center">
                <span className="inline-block px-3 py-0.5 rounded-full bg-rkg-crimson text-white text-[10px] font-bold">
                  本壘板 / 尊猿席
                </span>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="space-y-2.5 text-xs text-gray-600 mb-6">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>局數輪替原則</strong>：女孩通常在 1-3 局站一側，中場（第 4 局結束或第 5 局）於本壘前表演，7-8 局進行換側應援。</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span><strong>東R / 西R 舞台</strong>：假日或特定主題日延伸至內野走道的 R 舞台，拉近與球迷互動距離。</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span><strong>大樂區 / 特別專區</strong>：假日安排於大樂放鬆席或主題企劃專區進行互動式定點應援。</span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-bold text-sm bg-gray-900 hover:bg-black text-white transition active:scale-95 shadow-sm"
          >
            了解，關閉導覽
          </button>
        </div>
      </div>
    </div>
  );
};
