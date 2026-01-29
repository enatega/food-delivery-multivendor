'use client';

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { useTranslations } from 'next-intl';

interface IRejectionReasonModalProps {
  visible: boolean;
  onHide: () => void;
  onConfirm: (reason: string) => void;
  loading?: boolean;
}

export default function RejectionReasonModal({
  visible,
  onHide,
  onConfirm,
  loading = false,
}: IRejectionReasonModalProps) {
  const t = useTranslations();
  const [rejectionReason, setRejectionReason] = useState('');

  const handleConfirm = () => {
    if (rejectionReason.trim()) {
      onConfirm(rejectionReason.trim());
      setRejectionReason('');
    }
  };

  const handleHide = () => {
    setRejectionReason('');
    onHide();
  };

  return (
    <Dialog
      header={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <i className="pi pi-times text-red-600" />
          </div>
          <span className="text-lg font-semibold text-gray-800">{t('Reject Rider Request')}</span>
        </div>
      }
      visible={visible}
      onHide={handleHide}
      style={{ width: '500px' }}
      modal
      closable={!loading}
      className="p-dialog-custom"
    >
      <div className="space-y-6 p-2">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">
            {t('This action will reject the rider request. Please provide a clear reason for rejection.')}
          </p>
        </div>
        
        <div>
          <label htmlFor="rejectionReason" className="block text-sm font-semibold text-gray-700 mb-3">
            {t('Rejection Reason')} <span className="text-red-500">*</span>
          </label>
          <InputTextarea
            id="rejectionReason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={5}
            cols={30}
            placeholder={t('Please provide a detailed reason for rejecting this rider request...')}
            className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            disabled={loading}
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            label={t('Cancel')}
            icon="pi pi-times"
            onClick={handleHide}
            className="px-6 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading}
            text
          />
          <Button
            label={t('Reject Request')}
            icon="pi pi-ban"
            onClick={handleConfirm}
            className="px-6 py-2 bg-red-600 text-white border border-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-md"
            disabled={!rejectionReason.trim() || loading}
            loading={loading}
          />
        </div>
      </div>
    </Dialog>
  );
}