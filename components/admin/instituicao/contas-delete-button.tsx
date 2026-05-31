'use client';

import { useState } from 'react';
import { deleteContaBancaria } from '@/app/admin/instituicao/actions';
import { useRouter } from 'next/navigation';

interface ContasDeleteButtonProps {
  contaId: string;
}

export default function ContasDeleteButton({ contaId }: ContasDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteContaBancaria(contaId);
      if (result.success) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`delete-btn-confirm ${isDeleting ? 'disabled' : ''}`}
      >
        {isDeleting ? 'Removendo...' : 'Confirmar'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      disabled={isDeleting}
      title="Remover conta"
      className={`delete-btn ${isDeleting ? 'disabled' : ''}`}
    >
      Remover
    </button>
  );
}
