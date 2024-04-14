type SignupRequest = {
  email: string;
  password: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

type JwtPayload = {
  id: string;
  role: string;
  reqIP: string;
  agent: string;
  iat: number;
  exp: number;
};

export { SignupRequest, LoginRequest, JwtPayload };
