import { z } from "zod";

// ==========================================
// 1. Core Enumerations & Literals
// ==========================================

export const EventTypeSchema = z.enum(["wedding", "birthday", "community"]);
export type EventType = z.infer<typeof EventTypeSchema>;

export const ProvenanceSchema = z.enum([
  "user-entered",
  "ai-estimate",
  "confirmed-by-user",
]);
export type Provenance = z.infer<typeof ProvenanceSchema>;

export const TaskStatusSchema = z.enum(["todo", "in-progress", "done", "blocked"]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskPrioritySchema = z.enum(["low", "medium", "high"]);
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

export const SupportedCurrencySchema = z.enum(["USD", "EUR", "GBP", "INR", "CAD", "AUD"]);
export type SupportedCurrency = z.infer<typeof SupportedCurrencySchema>;

// ==========================================
// 2. Budget Item Schema
// ==========================================

export const BudgetItemSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1).max(100),
  label: z.string().min(1).max(200),
  amountMinor: z.number().int().nonnegative(), // Stored in cents/paise (integer)
  included: z.boolean().default(true),
  provenance: ProvenanceSchema,
  locked: z.boolean().default(false),
  isPerGuest: z.boolean().default(false), // Scales when guest count changes
  perGuestAmountMinor: z.number().int().nonnegative().optional(),
  note: z.string().max(500).optional(),
});
export type BudgetItem = z.infer<typeof BudgetItemSchema>;

// ==========================================
// 3. Event Task & Timeline Schema
// ==========================================

export const EventTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  status: TaskStatusSchema,
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid ISO date YYYY-MM-DD"),
  daysBeforeEvent: z.number().int().optional(), // Relative offset for schedule cascading
  dependsOn: z.array(z.string()).default([]), // Task IDs that must finish first
  priority: TaskPrioritySchema,
  locked: z.boolean().default(false),
  provenance: ProvenanceSchema,
  notes: z.string().max(500).optional(),
});
export type EventTask = z.infer<typeof EventTaskSchema>;

// ==========================================
// 4. Vendor Checklist Item Schema
// ==========================================

export const VendorItemSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1), // e.g., Venue, Catering, Photography, Florals, Sound/DJ
  role: z.string().min(1),
  status: z.enum(["not-contacted", "contacted", "quoted", "booked"]),
  estimatedCostMinor: z.number().int().nonnegative().optional(),
  confirmedCostMinor: z.number().int().nonnegative().optional(),
  provenance: ProvenanceSchema,
  notes: z.string().max(500).optional(),
  budgetItemId: z.string().optional(), // Link to BudgetItem
});
export type VendorItem = z.infer<typeof VendorItemSchema>;

// ==========================================
// 5. Personalized Idea Schema
// ==========================================

export const IdeaSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  rationale: z.string().min(1).max(500),
  category: z.string().min(1).max(100), // e.g. "Theme & Decor", "Guest Experience", "Budget Saver"
  estimatedCostMinor: z.number().int().nonnegative().optional(),
  provenance: z.literal("ai-estimate"),
  assumptions: z.array(z.string()).default([]),
});
export type Idea = z.infer<typeof IdeaSchema>;

// ==========================================
// 6. Plan Change Diff Schema (Signature Innovation)
// ==========================================

export const PlanChangeSchema = z.object({
  id: z.string().min(1),
  entityType: z.enum(["event", "budget-item", "task", "vendor-item", "idea"]),
  entityId: z.string().min(1),
  field: z.string().min(1),
  entityTitle: z.string().min(1),
  beforeValue: z.union([z.string(), z.number(), z.boolean()]),
  proposedValue: z.union([z.string(), z.number(), z.boolean()]),
  reason: z.string().min(1).max(500),
  isDeterministic: z.boolean().default(true),
  financialImpactMinor: z.number().int().default(0), // Change in budget (+/- cents)
  requiresApproval: z.literal(true),
  status: z.enum(["pending", "accepted", "rejected"]).default("pending"),
});
export type PlanChange = z.infer<typeof PlanChangeSchema>;

// ==========================================
// 7. Full Event Plan Schema
// ==========================================

export const EventPlanSchema = z.object({
  id: z.string().min(1),
  eventType: EventTypeSchema,
  title: z.string().min(1).max(200),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid ISO date YYYY-MM-DD"),
  guestCount: z.number().int().min(1).max(50000),
  currency: SupportedCurrencySchema.default("USD"),
  totalBudgetMinor: z.number().int().nonnegative(),
  priorities: z.array(z.string()).default([]),
  budgetItems: z.array(BudgetItemSchema).default([]),
  tasks: z.array(EventTaskSchema).default([]),
  vendorItems: z.array(VendorItemSchema).default([]),
  ideas: z.array(IdeaSchema).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type EventPlan = z.infer<typeof EventPlanSchema>;
