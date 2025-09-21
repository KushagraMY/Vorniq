import { X, Trash2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function ConfirmDeleteModal({ isOpen, title, message, onCancel, onConfirm }: ConfirmDeleteModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <p className="text-sm text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={() => onConfirm()} className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2">
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}


