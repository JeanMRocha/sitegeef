# Notificações, Timers e Avisos — Padrões do OpnForm

## Objetivo

Implementar um sistema robusto de notificações com suporte a timers, avisos e confirmações, baseado nos padrões comprovados do OpnForm (Laravel + Vue). Este skill documenta como criar notificações elegantes no GEEF ERP (Next.js + React).

## Quando usar

- Mostrar feedback ao usuário (sucesso, erro, aviso)
- Informar sobre expiração de sessão ou inatividade
- Pedir confirmação antes de ações destrutivas
- Exibir erros de validação com lista de problemas
- Implementar countdowns ou timers
- Avisar sobre draft, rascunho ou estado incompleto

## Arquitetura de notificações do OpnForm

### Stack do OpnForm

```
Frontend (Vue 3 + Nuxt)
├── useAlert() composable
├── @nuxt/ui toast system
└── Tailwind CSS styling

Backend (Laravel)
├── Notification classes (Mailable)
├── Queued listeners (ShouldQueue)
└── Mail queue (sync/redis/sqs)
```

### Padrão: Composable + Toast Provider

**OpnForm usa Vue 3 Composition API:**

```javascript
// useAlert.js (OpnForm pattern)
import { useToast } from '#ui/composables/useToast'

export function useAlert() {
  const toast = useToast()
  
  return {
    success(message, duration = 5000, actions = null) {
      toast.add({
        icon: 'check-circle',
        title: 'Success',
        description: message,
        actions: actions,
        timeout: duration
      })
    },
    error(message, duration = 5000) {
      toast.add({
        icon: 'exclamation-circle',
        title: 'Error',
        description: message,
        color: 'red',
        timeout: duration
      })
    },
    warning(message, duration = 10000) {
      toast.add({
        icon: 'exclamation-triangle',
        title: 'Warning',
        description: message,
        color: 'amber',
        timeout: duration
      })
    }
  }
}
```

## Adaptar para GEEF ERP (Next.js + React)

GEEF usa Next.js + React + Server Actions. Vamos adaptar o padrão do OpnForm.

### 1. Criar hook `useNotification`

**Arquivo:** `lib/hooks/useNotification.ts`

```typescript
'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'confirm';
export type NotificationDuration = number | null; // null = persistent

interface NotificationOptions {
  duration?: NotificationDuration;
  actions?: Array<{
    label: string;
    onClick: () => void | Promise<void>;
  }>;
  data?: Record<string, any>;
}

// Using browser's Notification API or custom store
// For GEEF, we can use browser toast or integrate with existing toast library

export function useNotification() {
  const queryClient = useQueryClient();

  const show = useCallback(
    (
      type: NotificationType,
      message: string,
      options: NotificationOptions = {}
    ) => {
      const {
        duration = type === 'warning' ? 10000 : 5000,
        actions = [],
        data = {}
      } = options;

      // Create notification object
      const notification = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        message,
        actions,
        duration,
        data,
        createdAt: Date.now(),
      };

      // If using browser Notification API
      if ('Notification' in window && Notification.permission === 'granted') {
        const title = {
          success: '✓ Sucesso',
          error: '✗ Erro',
          warning: '⚠ Aviso',
          info: 'ℹ Informação',
          confirm: '? Confirmação',
        }[type];

        new Notification(title, {
          body: message,
          tag: `geef-${notification.id}`,
          requireInteraction: type === 'confirm',
        });
      }

      // Dispatch to notification store/context
      // This would connect to your state management
      window.dispatchEvent(
        new CustomEvent('notification', { detail: notification })
      );

      // Auto-dismiss if duration is set
      if (duration && duration > 0) {
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('notification-dismiss', { detail: notification.id })
          );
        }, duration);
      }

      return notification.id;
    },
    []
  );

  const success = useCallback(
    (message: string, options?: NotificationOptions) => {
      return show('success', message, {
        duration: 5000,
        ...options,
      });
    },
    [show]
  );

  const error = useCallback(
    (message: string, options?: NotificationOptions) => {
      return show('error', message, {
        duration: 5000,
        ...options,
      });
    },
    [show]
  );

  const warning = useCallback(
    (message: string, options?: NotificationOptions) => {
      return show('warning', message, {
        duration: 10000,
        ...options,
      });
    },
    [show]
  );

  const confirm = useCallback(
    (message: string, options?: NotificationOptions) => {
      return show('confirm', message, {
        duration: null, // Persistent until dismissed
        ...options,
      });
    },
    [show]
  );

  const validationErrors = useCallback(
    (errors: Record<string, string[]>, duration = 10000) => {
      const errorList = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('\n');

      return show('error', `Por favor, corrija os erros:\n\n${errorList}`, {
        duration,
      });
    },
    [show]
  );

  const draftWarning = useCallback(
    (formName: string, options?: NotificationOptions) => {
      return show('warning', 
        `"${formName}" está em modo Rascunho e não está acessível publicamente. ` +
        `Você pode mudar o status na página de edição.`,
        {
          duration: 10000,
          ...options,
        }
      );
    },
    [show]
  );

  return {
    show,
    success,
    error,
    warning,
    confirm,
    validationErrors,
    draftWarning,
  };
}
```

### 2. Criar componente `NotificationProvider`

**Arquivo:** `components/providers/NotificationProvider.tsx`

```typescript
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  message: string;
  duration: number | null;
  actions?: Array<{ label: string; onClick: () => void }>;
}

const NotificationContext = createContext<Notification[]>([]);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleNotification = (e: Event) => {
      const event = e as CustomEvent;
      const notification = event.detail as Notification;
      setNotifications((prev) => [...prev, notification]);
    };

    const handleDismiss = (e: Event) => {
      const event = e as CustomEvent;
      const id = event.detail as string;
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    window.addEventListener('notification', handleNotification);
    window.addEventListener('notification-dismiss', handleDismiss);

    return () => {
      window.removeEventListener('notification', handleNotification);
      window.removeEventListener('notification-dismiss', handleDismiss);
    };
  }, []);

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
      <NotificationDisplay notifications={notifications} />
    </NotificationContext.Provider>
  );
}

function NotificationDisplay({ notifications }: { notifications: Notification[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notif) => (
        <NotificationCard key={notif.id} notification={notif} />
      ))}
    </div>
  );
}

function NotificationCard({ notification }: { notification: Notification }) {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    confirm: 'bg-purple-50 border-purple-200 text-purple-900',
  };

  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
    confirm: '?',
  };

  return (
    <div
      className={`border rounded-lg p-4 shadow-lg max-w-md ${colors[notification.type]}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-lg font-bold">{icons[notification.type]}</span>
        <div className="flex-1">
          <p className="font-semibold">{notification.message}</p>
          {notification.actions && notification.actions.length > 0 && (
            <div className="mt-2 flex gap-2">
              {notification.actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className="text-sm underline hover:opacity-75"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 3. Usar em Server Actions

**Arquivo:** `app/admin/pessoas/actions.ts`

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createPessoa(formData: FormData) {
  const supabase = await createClient();
  const nome = formData.get('nome')?.toString().trim() || '';
  const email = formData.get('email')?.toString().trim() || '';

  // Validação
  if (!nome || nome.length < 2) {
    throw new Error('Nome é obrigatório e deve ter no mínimo 2 caracteres');
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Email inválido');
  }

  const { data, error } = await supabase
    .from('pessoas')
    .insert([{ nome, email, status: 'ativo' }])
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao criar pessoa: ${error.message}`);
  }

  revalidatePath('/admin/pessoas');
  
  // Return success with data for client-side notification
  return {
    success: true,
    message: `Pessoa "${nome}" criada com sucesso!`,
    data: data,
    // Include share URL or action URL
    actionUrl: `/admin/pessoas/${data.id}`,
    actionLabel: 'Abrir',
  };
}
```

### 4. Usar em Page/Component

**Arquivo:** `app/admin/pessoas/novo/page.tsx`

```typescript
'use client';

import { createPessoa } from '../actions';
import { useNotification } from '@/lib/hooks/useNotification';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NovaPessoaPage() {
  const { success, error, validationErrors } = useNotification();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await createPessoa(formData);

      // Show success with action
      success(result.message, {
        duration: 5000,
        actions: [
          {
            label: result.actionLabel,
            onClick: () => router.push(result.actionUrl),
          },
        ],
      });

      // Reset form
      e.currentTarget.reset();

      // Navigate after a short delay
      setTimeout(() => {
        router.push('/admin/pessoas');
      }, 2000);
    } catch (err: any) {
      // Check if validation error
      if (err.message.includes('Por favor, corrija')) {
        validationErrors(JSON.parse(err.message));
      } else {
        error(err.message || 'Erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="area-page">
      <h1 className="admin-page-title">Nova Pessoa</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <div>
          <label>Nome</label>
          <input name="nome" type="text" required />
        </div>
        <div>
          <label>Email</label>
          <input name="email" type="email" />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Pessoa'}
        </button>
      </form>
    </div>
  );
}
```

## Padrão: Timers e Avisos

### 1. Aviso de Sessão Expirando

**Arquivo:** `lib/hooks/useSessionWarning.ts`

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { useNotification } from './useNotification';

export function useSessionWarning(expiresIn: number = 300000) {
  // 5 minutes = 300000ms
  const { confirm } = useNotification();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Aviso com 1 minuto antes da expiração
    const warningTime = expiresIn - 60000;

    timeoutRef.current = setTimeout(() => {
      confirm('Sua sessão vai expirar em 1 minuto. Deseja continuar?', {
        duration: null, // Persistent
        actions: [
          {
            label: 'Continuar',
            onClick: () => {
              // Refresh session token
              fetch('/api/auth/refresh', { method: 'POST' });
            },
          },
          {
            label: 'Logout',
            onClick: () => {
              fetch('/api/auth/logout', { method: 'POST' });
            },
          },
        ],
      });
    }, warningTime);

    return () => clearTimeout(timeoutRef.current);
  }, [expiresIn, confirm]);
}
```

### 2. Aviso de Draft/Rascunho

```typescript
// Em novo/page.tsx ou [id]/page.tsx
if (form.status === 'draft') {
  warning(
    `"${form.title}" está em modo Rascunho. ` +
    `Publique para tornar acessível publicamente.`,
    { duration: 10000 }
  );
}
```

### 3. Confirmação antes de deletar

```typescript
// Em componente de ação
async function handleDelete(id: string, name: string) {
  const notificationId = confirm(
    `Tem certeza que deseja deletar "${name}"? Esta ação não pode ser desfeita.`,
    {
      duration: null,
      actions: [
        {
          label: 'Deletar',
          onClick: async () => {
            try {
              await deletePessoa(id);
              success('Pessoa deletada com sucesso!');
            } catch (err) {
              error('Erro ao deletar pessoa');
            }
          },
        },
        {
          label: 'Cancelar',
          onClick: () => {
            // Notification will auto-dismiss
          },
        },
      ],
    }
  );
}
```

## Comparação: OpnForm vs GEEF

| Aspecto | OpnForm (Vue + Nuxt) | GEEF (Next.js + React) |
|--------|--------|--------|
| Composable | `useAlert()` | `useNotification()` |
| Toast system | @nuxt/ui | Custom via browser API + Context |
| State management | Pinia store | React Context + CustomEvent |
| Duration default | 5-10s | 5-10s |
| Actions support | ✅ Yes (clickable buttons) | ✅ Yes |
| Validation errors | ✅ formValidationError() | ✅ validationErrors() |
| Draft warning | ✅ Specific method | ✅ draftWarning() |
| Confirmation | ✅ confirm() | ✅ confirm() |
| Session timeout | 401 handler | useSessionWarning() hook |
| Queue/persistence | Email queue (Laravel) | N/A (real-time only) |

## Checklist: Implementar notificações

- [ ] Criar `lib/hooks/useNotification.ts`
- [ ] Criar `components/providers/NotificationProvider.tsx`
- [ ] Adicionar `<NotificationProvider>` no layout raiz
- [ ] Usar `useNotification()` em componentes client
- [ ] Lançar erros em server actions com mensagens claras
- [ ] Adicionar validação errors handler
- [ ] Implementar draft warnings
- [ ] Adicionar session expiry warning
- [ ] Testar confirmações antes de delete
- [ ] Documentar padrão em guides

## Referências

- **OpnForm:** https://github.com/OpnForm/OpnForm
  - useAlert.js: Composable de notificações
  - AppProvider.vue: Toast provider configuration
  - Notification classes: Laravel notifications
- **GEEF ERP:** Adaptar padrões para Next.js + React
