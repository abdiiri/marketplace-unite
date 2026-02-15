import { supabase } from "@/integrations/supabase/client";

export async function logAdminAction(
  action: string,
  targetType: string,
  targetId?: string,
  details?: string
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("admin_activity_logs").insert({
      admin_id: user.id,
      action,
      target_type: targetType,
      target_id: targetId || null,
      details: details || null,
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}
