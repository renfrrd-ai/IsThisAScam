-- Moderator applications table
CREATE TABLE IF NOT EXISTS public.moderator_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  reason text NOT NULL,
  experience text,
  availability text,
  status text NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.moderator_applications ENABLE ROW LEVEL SECURITY;

-- Only admins can see applications
CREATE POLICY "Admins can manage applications"
  ON public.moderator_applications
  FOR ALL
  TO authenticated
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_moderator_applications_status
  ON public.moderator_applications(status);

CREATE INDEX IF NOT EXISTS idx_moderator_applications_email
  ON public.moderator_applications(email);
