import { Router } from "express";
import { db, leadsTable, notesTable, insertLeadSchema, updateLeadSchema, updateLeadStatusSchema } from "@workspace/db";
import { eq, desc, ilike, and, sql } from "drizzle-orm";

const router = Router();

router.get("/leads", async (req, res) => {
  try {
    const { status, source, search } = req.query as Record<string, string | undefined>;
    const conditions: ReturnType<typeof eq>[] = [];

    if (status) conditions.push(eq(leadsTable.status, status as "new" | "contacted" | "converted" | "lost"));
    if (source) conditions.push(eq(leadsTable.source, source));
    if (search) {
      conditions.push(
        sql`(${leadsTable.name} ILIKE ${"%" + search + "%"} OR ${leadsTable.email} ILIKE ${"%" + search + "%"} OR ${leadsTable.company} ILIKE ${"%" + search + "%"})`
      );
    }

    const leads = await db
      .select()
      .from(leadsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(leadsTable.createdAt));

    res.json(leads.map(formatLead));
  } catch (err) {
    req.log.error({ err }, "Failed to list leads");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/leads", async (req, res) => {
  const parse = insertLeadSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid input", details: parse.error.issues });

  try {
    const [lead] = await db.insert(leadsTable).values(parse.data).returning();
    res.status(201).json(formatLead(lead));
  } catch (err) {
    req.log.error({ err }, "Failed to create lead");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/leads/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  try {
    const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, id));
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    const notes = await db.select().from(notesTable).where(eq(notesTable.leadId, id)).orderBy(desc(notesTable.createdAt));

    res.json({ ...formatLead(lead), leadNotes: notes.map(formatNote) });
  } catch (err) {
    req.log.error({ err }, "Failed to get lead");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/leads/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const parse = updateLeadSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid input", details: parse.error.issues });

  try {
    const [updated] = await db
      .update(leadsTable)
      .set({ ...parse.data, updatedAt: new Date() })
      .where(eq(leadsTable.id, id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Lead not found" });
    res.json(formatLead(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update lead");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/leads/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  try {
    const [deleted] = await db.delete(leadsTable).where(eq(leadsTable.id, id)).returning();
    if (!deleted) return res.status(404).json({ error: "Lead not found" });
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete lead");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/leads/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const parse = updateLeadStatusSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid input", details: parse.error.issues });

  try {
    const [updated] = await db
      .update(leadsTable)
      .set({ status: parse.data.status, updatedAt: new Date() })
      .where(eq(leadsTable.id, id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Lead not found" });
    res.json(formatLead(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update lead status");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatLead(lead: typeof leadsTable.$inferSelect) {
  return {
    ...lead,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
}

function formatNote(note: typeof notesTable.$inferSelect) {
  return {
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export default router;
