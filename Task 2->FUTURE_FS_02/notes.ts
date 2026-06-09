import { Router } from "express";
import { db, notesTable, leadsTable, insertNoteSchema, updateNoteSchema } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/leads/:id/notes", async (req, res) => {
  const leadId = Number(req.params.id);
  if (isNaN(leadId)) return res.status(400).json({ error: "Invalid ID" });

  try {
    const [lead] = await db.select().from(leadsTable).where(eq(leadsTable.id, leadId));
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    const notes = await db.select().from(notesTable).where(eq(notesTable.leadId, leadId)).orderBy(desc(notesTable.createdAt));
    res.json(notes.map(formatNote));
  } catch (err) {
    req.log.error({ err }, "Failed to list notes");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/leads/:id/notes", async (req, res) => {
  const leadId = Number(req.params.id);
  if (isNaN(leadId)) return res.status(400).json({ error: "Invalid ID" });

  const parse = insertNoteSchema.safeParse({ ...req.body, leadId });
  if (!parse.success) return res.status(400).json({ error: "Invalid input", details: parse.error.issues });

  try {
    const [note] = await db.insert(notesTable).values(parse.data).returning();
    res.status(201).json(formatNote(note));
  } catch (err) {
    req.log.error({ err }, "Failed to create note");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/notes/:noteId", async (req, res) => {
  const noteId = Number(req.params.noteId);
  if (isNaN(noteId)) return res.status(400).json({ error: "Invalid ID" });

  const parse = updateNoteSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid input", details: parse.error.issues });

  try {
    const [updated] = await db
      .update(notesTable)
      .set({ ...parse.data, updatedAt: new Date() })
      .where(eq(notesTable.id, noteId))
      .returning();

    if (!updated) return res.status(404).json({ error: "Note not found" });
    res.json(formatNote(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update note");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/notes/:noteId", async (req, res) => {
  const noteId = Number(req.params.noteId);
  if (isNaN(noteId)) return res.status(400).json({ error: "Invalid ID" });

  try {
    const [deleted] = await db.delete(notesTable).where(eq(notesTable.id, noteId)).returning();
    if (!deleted) return res.status(404).json({ error: "Note not found" });
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete note");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatNote(note: typeof notesTable.$inferSelect) {
  return {
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export default router;
