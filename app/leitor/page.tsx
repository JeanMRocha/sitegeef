import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata = {
  title: 'Minha Área - Biblioteca GEEF',
};

async function LeitorContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get pessoa data
  const { data: usuario } = await supabase
    .from('usuarios_sistema')
    .select('pessoa_id')
    .eq('id', user.id)
    .single();

  if (!usuario) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.8rem',
          color: '#666',
        }}>
          <p>Usuário não encontrado. Entre em contato com a administração.</p>
        </div>
      </div>
    );
  }

  // Get emprestimos ativos
  const { data: emprestimos } = await supabase
    .from('emprestimos')
    .select(
      `
      id, data_retirada, prazo_devolucao, status,
      exemplares (codigo, obra:obras (titulo, autor))
    `
    )
    .eq('pessoa_id', usuario.pessoa_id)
    .eq('status', 'em_aberto')
    .order('prazo_devolucao', { ascending: true });

  // Get reservas
  const { data: reservas } = await supabase
    .from('reservas')
    .select(
      `
      id, posicao_fila, criado_em,
      obras (titulo, autor)
    `
    )
    .eq('pessoa_id', usuario.pessoa_id)
    .eq('status', 'aguardando')
    .order('posicao_fila', { ascending: true });

  // Get pessoa info
  const { data: pessoa } = await supabase
    .from('pessoas')
    .select('nome, email')
    .eq('id', usuario.pessoa_id)
    .single();

  const today = new Date().toISOString().split('T')[0];
  const emprestimosVencidos = emprestimos?.filter((e: any) => e.prazo_devolucao < today) || [];
  const emprestimosAtivos = emprestimos?.filter((e: any) => e.prazo_devolucao >= today) || [];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem', fontSize: '2rem', fontWeight: 700 }}>
          👋 Olá, {pessoa?.nome}!
        </h1>
        <p style={{ margin: 0, color: '#666' }}>
          Acompanhe seus empréstimos e reservas na biblioteca
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Empréstimos Ativos
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {emprestimos?.length || 0}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Em Atraso
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: emprestimosVencidos.length > 0 ? '#ef4444' : '#22c55e' }}>
            {emprestimosVencidos.length}
          </p>
        </div>
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#999' }}>
            Reservas Aguardando
          </p>
          <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
            {reservas?.length || 0}
          </p>
        </div>
      </div>

      {/* Empréstimos com Atraso */}
      {emprestimosVencidos.length > 0 && (
        <div style={{
          padding: '1.5rem',
          marginBottom: '2rem',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '0.8rem',
        }}>
          <p style={{ margin: 0, color: '#ef4444', fontWeight: 600 }}>
            ⚠️ Você tem {emprestimosVencidos.length} livro(s) com prazo de devolução vencido.
            Entre em contato com a biblioteca para devolvê-los.
          </p>
        </div>
      )}

      {/* Empréstimos Ativos */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.3rem', fontWeight: 600 }}>
          📚 Meus Empréstimos
        </h2>
        {emprestimosAtivos.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {emprestimosAtivos.map((emp: any) => {
              const diasRestantes = Math.ceil(
                (new Date(emp.prazo_devolucao + 'T00:00:00').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={emp.id}
                  style={{
                    padding: '1.5rem',
                    backgroundColor: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '0.8rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '1rem' }}>
                      {emp.exemplares?.obra?.titulo}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#666' }}>
                      {emp.exemplares?.obra?.autor && `por ${emp.exemplares.obra.autor}`}
                    </p>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#999' }}>
                      Código: {emp.exemplares?.codigo}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#999' }}>
                      Devolve em
                    </p>
                    <p style={{
                      margin: '0.25rem 0',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: diasRestantes <= 3 ? '#f97316' : '#22c55e',
                    }}>
                      {diasRestantes} dia{diasRestantes !== 1 ? 's' : ''}
                    </p>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#999' }}>
                      {new Date(emp.prazo_devolucao + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            borderRadius: '0.8rem',
            color: '#999',
          }}>
            <p>Você não tem livros emprestados no momento.</p>
            <Link href="/escalas" style={{
              marginTop: '1rem',
              display: 'inline-block',
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: 500,
            }}>
              Visitar biblioteca →
            </Link>
          </div>
        )}
      </div>

      {/* Reservas */}
      <div>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.3rem', fontWeight: 600 }}>
          ⏳ Minhas Reservas
        </h2>
        {reservas && reservas.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reservas.map((res: any) => {
              const diasEsperando = Math.floor(
                (new Date().getTime() - new Date(res.criado_em).getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={res.id}
                  style={{
                    padding: '1.5rem',
                    backgroundColor: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '0.8rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <p style={{ margin: '0 0 0.5rem', fontWeight: 600, fontSize: '1rem' }}>
                      {res.obras?.titulo}
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#666' }}>
                      {res.obras?.autor && `por ${res.obras.autor}`}
                    </p>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#999' }}>
                      Aguardando disponibilidade
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#999' }}>
                      Posição na fila
                    </p>
                    <p style={{ margin: '0.25rem 0', fontSize: '1.5rem', fontWeight: 600, color: '#a855f7' }}>
                      #{res.posicao_fila}
                    </p>
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#999' }}>
                      há {diasEsperando} dia{diasEsperando !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            borderRadius: '0.8rem',
            color: '#999',
          }}>
            <p>Você não tem reservas pendentes.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5e5e5', textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>
        <p>Para mais informações, acesse a <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>página principal</Link>.</p>
      </div>
    </div>
  );
}

export default function LeitorPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Carregando sua área...</div>}>
      <LeitorContent />
    </Suspense>
  );
}
