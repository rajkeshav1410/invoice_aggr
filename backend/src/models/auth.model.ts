import { z } from "zod";

const SignupRequestSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+\\|[\]{};:'",.<>/?])(?=.*[0-9]).{6,}$/
    ),
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
