// ─── Chat & Staff Communication ──────────────────────────────────────────────

export type MessageSenderType = 'GUEST' | 'STAFF' | 'SYSTEM';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ';
export type MessageInputType = 'TEXT' | 'VOICE' | 'EMERGENCY';
export type ConversationStatus = 'OPEN' | 'ACTIVE' | 'RESOLVED' | 'ESCALATED';

export interface Message {
  id: string;
  conversationId: string;
  senderType: MessageSenderType;
  senderId?: string;         // staffId if STAFF, null if GUEST
  originalText: string;      // text as received
  originalLanguage: string;
  translatedText?: string;   // translated version
  targetLanguage?: string;
  inputType: MessageInputType;
  audioUrl?: string;
  translationConfidence?: number;
  usedApprovedTemplate?: boolean;
  status: MessageStatus;
  createdAt: string;
}

export interface Conversation {
  id: string;
  sessionId: string;
  eventId: string;
  venueId?: string;
  guestLanguage: string;
  status: ConversationStatus;
  assignedStaffId?: string;
  isEmergency: boolean;
  zone?: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

// ─── Staff Quick Replies ──────────────────────────────────────────────────────

export interface QuickReply {
  id: string;
  category: string;
  templateText: string;                   // English template
  translations: Record<string, string>; // language code → translation
  isActive: boolean;
}
