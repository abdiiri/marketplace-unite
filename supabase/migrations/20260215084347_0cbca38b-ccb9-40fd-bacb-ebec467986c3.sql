
-- Allow admins to delete support tickets
CREATE POLICY "Admins can delete support tickets"
  ON public.support_tickets FOR DELETE
  USING (has_role(auth.uid(), 'admin') OR is_super_admin(auth.uid()));
