'use client';

import { useState } from 'react';
import { deleteContato } from '@/app/admin/instituicao/actions';
import { useRouter } from 'next/navigation';

interface ContatosDeleteButtonProps {
  contatoId: string;
}

export default function ContatosDeleteButton({ contatoId }: ContatosDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteContato(contatoId);
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
      <div className="inline-confirm-popup">
        <p className="inline-confirm-title">Remover?</p>
        <div className="inline-confirm-actions">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`inline-confirm-btn inline-confirm-btn-danger ${isDeleting ? 'disabled' : ''}`}
          >
            Sim
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
            className="inline-confirm-btn inline-confirm-btn-cancel"
          >
            Não
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      disabled={isDeleting}
      title="Remover contato"
      className={`inline-delete-icon-btn ${isDeleting ? 'disabled' : ''}`}
    >
      ✕
    </button>
  );
}
