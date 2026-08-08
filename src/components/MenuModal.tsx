import { X, RotateCcw, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  onReturnToTitle: () => void;
}

export function MenuModal({ isOpen, onClose, onRetry, onReturnToTitle }: MenuModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">メニュー</h2>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <button 
                onClick={() => {
                  if(confirm("進行状況は失われます。最初からやり直しますか？")) {
                    onRetry();
                    onClose();
                  }
                }}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold transition-colors"
              >
                <RotateCcw size={20} />
                <span>最初からやり直す</span>
              </button>

              <button 
                onClick={() => {
                  if(confirm("進行状況は失われます。タイトルへ戻りますか？")) {
                    onReturnToTitle();
                    onClose();
                  }
                }}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-colors"
              >
                <Home size={20} />
                <span>タイトルへ戻る</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
