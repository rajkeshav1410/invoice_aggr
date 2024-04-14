import { z } from "zod";

const EnterpriseCreateSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  gstin: z
    .string()
    .regex(new RegExp(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}/)),
});

type EnterpriseCreateRequest = z.infer<typeof EnterpriseCreateSchema>;

export { EnterpriseCreateSchema, EnterpriseCreateRequest };
