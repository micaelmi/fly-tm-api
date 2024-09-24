// types.d.ts ou no seu arquivo principal
import { JwtPayload } from "jsonwebtoken";

declare module "fastify" {
  interface FastifyRequest {
    user: string | JwtPayload; // Ajuste o tipo de acordo com o que você espera em `decoded`
  }
}
