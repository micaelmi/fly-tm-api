import bcrypt from "bcrypt";
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import jwt from "jsonwebtoken";
import z from "zod";
import { env } from "../../env";
import { ClientError } from "../../errors/client-error";
import { prisma } from "../../lib/prisma";

export async function login(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users/login",
    {
      schema: {
        summary: "User Login",
        tags: ["users"],
        body: z.object({
          credential: z.string().min(4), // username or password
          password: z.string().min(8).max(32),
          // rememberMe: z.boolean().default(true),
        }),
      },
    },
    async (request, reply) => {
      const { credential, password } = request.body;

      const user = await prisma.user.findFirst({
        where: {
          OR: [{ username: credential }, { email: credential }],
        },
      });

      if (!user) throw new ClientError("User does not exist");

      if (user.status === "inactive")
        throw new ClientError("User isn't active yet");

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) throw new ClientError("Password does not match");

      const secretJwtKey = env.SECRET_JWT_KEY;

      const expirationTime = "30d";
      // const expirationTime = rememberMe ? "30d" : "24h";

      const token = jwt.sign(
        {
          sub: user.id,
          name: user.name,
          username: user.username,
          type: user.user_type_id,
          // rememberMe: rememberMe,
        },
        secretJwtKey,
        { expiresIn: expirationTime }
      );

      return reply.send({ token });
    }
  );
}
