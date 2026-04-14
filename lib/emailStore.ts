import { create } from 'zustand';

// Matches the backend Email model exactly
export type Email = {
  id: number;
  from: string;
  to: string;
  subject: string;
  body: string;
  status: string;
  emailType: string;
  sentAt: string;
  leadId?: number | null;
  contactId?: number | null;
  userId: number;
  opened?: boolean;
  openedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

// Payload shape expected by POST /emails
export type CreateEmailPayload = {
  from: string;
  to: string;
  subject: string;
  body: string;
  status?: string;
  emailType?: string;
  sentAt?: string;
  userId: number;
  leadId?: number;
  contactId?: number;
};

type EmailState = {
  emails: Email[];
  loading: boolean;
  error: string | null;

  /** Load emails for a contact sent by a specific user */
  loadEmails: (userId: number, contactId: number) => Promise<void>;

  /** Load emails for a lead sent by a specific user */
  loadEmailsForLead: (userId: number, leadId: number) => Promise<void>;

  /** Send an email via POST /emails */
  sendEmail: (payload: CreateEmailPayload) => Promise<Email>;

  /** Delete an email record */
  deleteEmail: (id: number) => Promise<void>;
};

const base = process.env.NEXT_PUBLIC_API_URL || '';

export const useEmailStore = create<EmailState>((set) => ({
  emails: [],
  loading: false,
  error: null,

  loadEmails: async (userId: number, contactId: number) => {
    set({ loading: true, error: null });
    try {
      const url = `${base}/emails/user/${userId}/contact/${contactId}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error(`Failed to load emails: ${await res.text()}`);
      const data = await res.json();
      set({ emails: Array.isArray(data) ? data : [], loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.message || 'Failed to load emails' });
    }
  },

  loadEmailsForLead: async (userId: number, leadId: number) => {
    set({ loading: true, error: null });
    try {
      const url = `${base}/emails/user/${userId}/lead/${leadId}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error(`Failed to load emails: ${await res.text()}`);
      const data = await res.json();
      set({ emails: Array.isArray(data) ? data : [], loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.message || 'Failed to load emails' });
    }
  },

  sendEmail: async (payload) => {
    set({ loading: true, error: null });
    const body: CreateEmailPayload = {
      status: 'sent',
      emailType: 'transactional',
      sentAt: new Date().toISOString(),
      ...payload,
    };
    try {
      const res = await fetch(`${base}/emails`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => 'Unknown error');
        set({ loading: false, error: msg });
        throw new Error(`Failed to send email: ${msg}`);
      }
      const data: Email = await res.json();
      set((state) => ({ emails: [data, ...state.emails], loading: false }));
      return data;
    } catch (err: any) {
      set({ loading: false, error: err?.message || 'Failed to send email' });
      throw err;
    }
  },

  deleteEmail: async (id: number) => {
    set({ loading: true });
    try {
      const res = await fetch(`${base}/emails/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed to delete email: ${await res.text()}`);
      set((state) => ({ emails: state.emails.filter((e) => e.id !== id), loading: false }));
    } catch (err: any) {
      set({ loading: false, error: err?.message });
      throw err;
    }
  },
}));