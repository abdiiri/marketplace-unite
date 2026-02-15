
-- Create admin activity logs table
CREATE TABLE public.admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text,
  details text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Only admins/super_admins can view logs
CREATE POLICY "Admins can view activity logs"
  ON public.admin_activity_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR is_super_admin(auth.uid()));

-- Only admins/super_admins can insert logs
CREATE POLICY "Admins can insert activity logs"
  ON public.admin_activity_logs FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin') OR is_super_admin(auth.uid()));

-- Create index for faster queries
CREATE INDEX idx_activity_logs_created_at ON public.admin_activity_logs (created_at DESC);
CREATE INDEX idx_activity_logs_admin_id ON public.admin_activity_logs (admin_id);
