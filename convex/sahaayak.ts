import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

/**
 * Sahaayak caregiver mirror — opt-in sync of the on-device log.
 *
 * The board itself never calls these; syncing happens only when a signed-in
 * caregiver opens the Insights page with "Share activity" switched on. All
 * queries are scoped to the signed-in user: a caregiver sees their own
 * device's mirror, nothing else.
 */

const KINDS = ["tap", "sentence", "repair", "scene", "speak"] as const;

/** Push a batch of locally-logged events (called from the Insights page). */
export const pushEvents = mutation({
  args: {
    events: v.array(
      v.object({
        kind: v.union(...KINDS.map((k) => v.literal(k))),
        wordId: v.optional(v.string()),
        scene: v.string(),
        at: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");
    for (const e of args.events) {
      await ctx.db.insert("eventLogs", { ...e, userId });
    }
    return args.events.length;
  },
});

/** Push "not that" repairs, deduplicated by their local id. */
export const pushRepairs = mutation({
  args: {
    repairs: v.array(
      v.object({
        localId: v.string(),
        rejectedId: v.string(),
        chosenId: v.optional(v.string()),
        scene: v.string(),
        at: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");

    const existing = await ctx.db
      .query("repairs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const seen = new Set(existing.map((r) => r.localId));

    let inserted = 0;
    for (const r of args.repairs) {
      if (seen.has(r.localId)) continue;
      await ctx.db.insert("repairs", { ...r, userId });
      seen.add(r.localId);
      inserted += 1;
    }
    return inserted;
  },
});

/** Push sentences the child confirmed. */
export const pushSentences = mutation({
  args: {
    sentences: v.array(
      v.object({
        text: v.string(),
        lang: v.union(v.literal("en"), v.literal("hi")),
        scene: v.string(),
        at: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");
    for (const s of args.sentences) {
      await ctx.db.insert("sentences", { ...s, userId });
    }
    return args.sentences.length;
  },
});

export const getEvents = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    return await ctx.db
      .query("eventLogs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getRepairs = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    return await ctx.db
      .query("repairs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getSentences = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    return await ctx.db
      .query("sentences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

/** Wipe this user's mirror (data-use promise: on-device by default, deletable). */
export const clearMirror = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not signed in");
    for (const table of ["eventLogs", "repairs", "sentences"] as const) {
      const rows = await ctx.db
        .query(table)
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
      for (const row of rows) {
        await ctx.db.delete(row._id);
      }
    }
    return true;
  },
});

/** Internal helper: nudge "chosen" onto a repair after the child picks a word. */
export const linkChosen = internalMutation({
  args: { localId: v.string(), chosenId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return;
    const rows = await ctx.db
      .query("repairs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const row = rows.find((r) => r.localId === args.localId);
    if (row) {
      await ctx.db.patch(row._id, { chosenId: args.chosenId });
    }
  },
});
