// Temporary types for new database tables
export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  avatar_url: string | null;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface Call {
  id: string;
  user_id: string;
  client_id: string | null;
  client_name: string;
  client_company: string | null;
  duration: number | null;
  date: string;
  time: string;
  status: "completed" | "scheduled" | "missed" | "cancelled";
  outcome: "positive" | "neutral" | "negative" | "follow_up";
  recording_url: string | null;
  transcript: string | null;
  summary: string | null;
  action_items: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  user_id: string;
  name: string;
  subject: string;
  content: string;
  type: "follow_up" | "proposal" | "meeting_request" | "thank_you";
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface SmsTemplate {
  id: string;
  user_id: string;
  name: string;
  content: string;
  type: "follow_up" | "appointment_reminder" | "thank_you";
  is_default: boolean;
  created_at: string;
  updated_at: string;
}