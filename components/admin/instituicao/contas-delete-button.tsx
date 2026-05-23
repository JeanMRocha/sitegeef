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
        style={{
          padding: '0.25rem 0.5rem',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          fontSize: '0.75rem',
          cursor: isDeleting ? 'not-allowed' : 'pointer',
          opacity: isDeleting ? 0.6 : 1,
        }}
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
      style={{
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        border: '1px solid #fca5a5',
        borderRadius: '0.25rem',
        cursor: 'pointer',
        fontSize: '0.75rem',
        padding: '0.25rem 0.5rem',
        opacity: isDeleting ? 0.6 : 1,
      }}
    >
      Remover
    </button>
  );
}
