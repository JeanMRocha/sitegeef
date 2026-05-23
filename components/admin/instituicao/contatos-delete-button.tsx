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
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        backgroundColor: 'white',
        border: '1px solid var(--border)',
        borderRadius: '0.5rem',
        padding: '0.5rem',
        zIndex: 10,
      }}>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', fontWeight: 600 }}>Remover?</p>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
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
            Sim
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: 'var(--border)',
              border: 'none',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
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
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        color: '#dc2626',
        cursor: 'pointer',
        fontSize: '1rem',
        padding: '0.25rem',
        opacity: isDeleting ? 0.6 : 1,
      }}
    >
      ✕
    </button>
  );
}
