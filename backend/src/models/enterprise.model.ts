import { z } from "zod";
import { RegexPatterns } from "../common/constants";

const EnterpriseCreateSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  gstin: z.string().regex(RegexPatterns.GSTIN),
});

type EnterpriseCreateRequest = z.infer<typeof EnterpriseCreateSchema>;

type EnterpriseResponse = EnterpriseCreateRequest & {
  enterpriseId: string;
  isCreator: boolean;
};

const EnterpriseEditSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  gstin: z.string().regex(RegexPatterns.GSTIN),
});

type EnterpriseEditRequest = z.infer<typeof EnterpriseEditSchema>;

export {
  EnterpriseCreateSchema,
  EnterpriseCreateRequest,
  EnterpriseResponse,
  EnterpriseEditSchema as EnterpriseEditScema,
  EnterpriseEditRequest,
};
