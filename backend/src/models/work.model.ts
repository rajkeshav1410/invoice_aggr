import { z } from "zod";

const WorkCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  period: z.coerce.date(),
  partyId: z.string(),
});

type WorkCreateRequest = z.infer<typeof WorkCreateSchema>;

export { WorkCreateSchema, WorkCreateRequest };
