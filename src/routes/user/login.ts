import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ClientError } from "../../errors/client-error";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { env } from "../../env";
import jwt from "jsonwebtoken";

export async function login(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users/login",
    {
      schema: {
        summary: "User Login",
        tags: ["users"],
        body: z.object({
          credential: z.string().min(4),
          password: z.string().min(8),
          rememberMe: z.boolean().default(false),
        }),
      },
    },
    async (request) => {
      const { credential, password, rememberMe } = request.body;

      const user = await prisma.user.findFirst({
        where: {
          OR: [{ username: credential }, { email: credential }],
        },
      });

      if (!user) throw new ClientError("User does not exist");

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) throw new ClientError("Password does not match");

      const secretJwtKey = env.SECRET_JWT_KEY;

      const expirationTime = rememberMe ? "30d" : "24h";

      const token = jwt.sign(
        {
          sub: user.id,
          name: user.name,
          type: user.user_type_id,
        },
        secretJwtKey,
        { expiresIn: expirationTime }
      );

      return { token };
    }
  );
}
