export type Profile = {
  id: string;
  name: string | null;
  role: string | null;
  bundle_credits: number | null;
  created_at: string;
  updated_at: string;
  email: string | null;
};

export type ProfileInsert = {
  id: string;
  name?: string | null;
  role?: string | null;
  bundle_credits?: number | null;
  email?: string | null;
};

export type ProfileUpdate = {
  name?: string | null;
  role?: string | null;
  bundle_credits?: number | null;
  email?: string | null;
};