import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/async-handler";
import { ApiError } from "../lib/api-error";

// Use any to bypass type issues with new table
type AnySupabase = any;

export function createModeratorRouter(supabase: AnySupabase) {
  const router = Router();

  // Public: Submit application
  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const schema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        reason: z.string().min(10),
        experience: z.string().optional(),
        availability: z.string().optional(),
      });

      const data = schema.parse(req.body);

      const { data: result, error } = await supabase
        .from("moderator_applications")
        .insert({
          name: data.name,
          email: data.email,
          reason: data.reason,
          experience: data.experience || null,
          availability: data.availability || null,
        })
        .select("*")
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        message: "Application received. We'll contact you soon.",
        id: result.id,
      });
    }),
  );

  // Admin: List applications
  router.get(
    "/",
    asyncHandler(async (req, res) => {
      const status = req.query.status as string | undefined;

      let query = supabase
        .from("moderator_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) throw error;
      res.json({ applications: data || [] });
    }),
  );

  // Admin: Update application status
  router.patch(
    "/:id",
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const schema = z.object({
        status: z.enum(["approved", "rejected"]),
        adminNotes: z.string().optional(),
      });
      const { status, adminNotes } = schema.parse(req.body);

      const { data, error } = await supabase
        .from("moderator_applications")
        .update({
          status,
          admin_notes: adminNotes || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;
      if (!data) throw new ApiError(404, "Application not found");

      res.json({ application: data });
    }),
  );

  return router;
}
