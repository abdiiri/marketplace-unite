
-- Allow admins to delete services (not just super_admin)
DROP POLICY IF EXISTS "Users can delete their own services" ON public.services;
CREATE POLICY "Users can delete their own services"
  ON public.services FOR DELETE
  USING (auth.uid() = user_id OR is_super_admin(auth.uid()) OR has_role(auth.uid(), 'admin'));

-- Allow admins to delete profiles (not just super_admin)
DROP POLICY IF EXISTS "Super admin can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (is_super_admin(auth.uid()) OR (has_role(auth.uid(), 'admin') AND NOT is_super_admin(id)));

-- Allow admins to view all service requests
DROP POLICY IF EXISTS "Admins can view all requests" ON public.service_requests;
CREATE POLICY "Admins can view all requests"
  ON public.service_requests FOR SELECT
  USING (has_role(auth.uid(), 'admin') OR is_super_admin(auth.uid()));

-- Allow admins to update any service request
CREATE POLICY "Admins can update any request"
  ON public.service_requests FOR UPDATE
  USING (has_role(auth.uid(), 'admin') OR is_super_admin(auth.uid()));

-- Allow admins to delete service requests
CREATE POLICY "Admins can delete service requests"
  ON public.service_requests FOR DELETE
  USING (has_role(auth.uid(), 'admin') OR is_super_admin(auth.uid()));

-- Allow admins to delete categories
DROP POLICY IF EXISTS "Users can delete their own categories" ON public.categories;
CREATE POLICY "Users or admins can delete categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id OR is_super_admin(auth.uid()) OR has_role(auth.uid(), 'admin'));

-- Allow admins to update categories
DROP POLICY IF EXISTS "Users can update their own categories" ON public.categories;
CREATE POLICY "Users or admins can update categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id OR is_super_admin(auth.uid()) OR has_role(auth.uid(), 'admin'));
