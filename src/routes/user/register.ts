import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ClientError } from "../../errors/client-error";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

export async function registerUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users/register",
    {
      schema: {
        summary: "Create user",
        tags: ["users"],
        body: z.object({
          name: z.string().min(4),
          username: z.string().min(4),
          email: z.string().email(),
          password: z.string().min(8),
        }),
      },
    },
    async (request) => {
      const { name, username, email, password } = request.body;

      const existingUsername = await prisma.user.findFirst({
        select: { id: true },
        where: { username },
      });
      const existingEmail = await prisma.user.findFirst({
        select: { id: true },
        where: { email },
      });

      if (existingUsername) throw new ClientError("Username already in use");

      if (existingEmail) throw new ClientError("Email already in use");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
          user_type_id: 1,
        },
      });

      return { userId: user.id };
    }
  );
}
