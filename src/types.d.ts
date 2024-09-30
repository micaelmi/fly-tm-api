// types.d.ts ou no seu arquivo principal
import { JwtPayload } from "jsonwebtoken";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      sub: string;
      name: string;
      username: string;
      type: number;
      iat: number;
      exp: number;
    };
  }
}
