import { Router } from "express";
import { db, leadsTable } from "@workspace/db";
import { eq, desc, count, sql } from "drizzle-orm";

const router = Router();

router.get("/dashboard/stats", async (req, res) => {
  try {
    const [totals] = await db
      .select({ total: count() })
      .from(leadsTable);

    const byStatus = await db
      .select({ status: leadsTable.status, count: count() })
      .from(leadsTable)
      .groupBy(leadsTable.status);

    const bySource = await db
      .select({ source: leadsTable.source, count: count() })
      .from(leadsTable)
      .groupBy(leadsTable.source)
      .orderBy(desc(count()));

    const totalLeads = totals.total;
    const statusMap: Record<string, number> = { new: 0, contacted: 0, converted: 0, lost: 0 };
    for (const row of byStatus) {
      statusMap[row.status] = row.count;
    }

    const converted = statusMap.converted;
    const conversionRate = totalLeads > 0 ? Math.round((converted / totalLeads) * 100 * 10) / 10 : 0;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const [recent] = await db
      .select({ count: count() })
      .from(leadsTable)
      .where(sql`${leadsTable.createdAt} >= ${oneWeekAgo}`);

    res.json({
      totalLeads,
      byStatus: {
        new: statusMap.new,
        contacted: statusMap.contacted,
        converted: statusMap.converted,
        lost: statusMap.lost,
      },
      conversionRate,
      recentCount: recent.count,
      bySource: bySource.map(r => ({ source: r.source, count: r.count })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/dashboard/recent", async (req, res) => {
  try {
    const leads = await db
      .select()
      .from(leadsTable)
      .orderBy(desc(leadsTable.updatedAt))
      .limit(10);

    res.json(leads.map(lead => ({
      ...lead,
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to get recent leads");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
