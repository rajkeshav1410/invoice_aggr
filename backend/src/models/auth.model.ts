import { z } from "zod";
import { RegexPatterns } from "../common/constants";

const SignupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).regex(RegexPatterns.PASSWORD),
});

type SignupRequest = z.infer<typeof SignupRequestSchema>;

const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginRequest = z.infer<typeof LoginRequestSchema>;

type JwtPayload = {
  id: string;
  role: string;
  reqIP: string;
  agent: string;
  iat: number;
  exp: number;
};

export {
  SignupRequestSchema,
  SignupRequest,
  LoginRequestSchema,
  LoginRequest,
  JwtPayload,
};
