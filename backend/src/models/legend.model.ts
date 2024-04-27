import { z } from "zod";

const LegendCreateSchema = z.object({
  workId: z.string(),
  enterpriseId: z.string(),
  invoice: z.string(),
  invoiceDate: z.coerce.date(),
  p18: z.number().optional().default(0),
  p12: z.number().optional().default(0),
  p5: z.number().optional().default(0),
  p0: z.number().optional().default(0),
});

type LegendCreateRequest = z.infer<typeof LegendCreateSchema>;

const LegendListSchema = z.object({
  workId: z.string().optional(),
  enterpriseId: z.string().optional(),
  invoice: z.string().optional(),
  invoiceDate: z.coerce.date().optional(),
});

type LegendListRequest = z.infer<typeof LegendListSchema>;

const LegendEditSchema = z.object({
  legendId: z.string(),
  enterpriseId: z.string().optional(),
  invoice: z.string().optional(),
  invoiceDate: z.coerce.date().optional(),
  p18: z.number().optional(),
  p12: z.number().optional(),
  p5: z.number().optional(),
  p0: z.number().optional(),
});

type LegendEditRequest = z.infer<typeof LegendEditSchema>;

export {
  LegendCreateSchema,
  LegendCreateRequest,
  LegendListSchema,
  LegendListRequest,
  LegendEditSchema,
  LegendEditRequest
};
