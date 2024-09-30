import bcrypt from "bcrypt";
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ClientError } from "../../errors/client-error";
import { prisma } from "../../lib/prisma";

export async function changeUsername(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/users/:userId/change-username",
    {
      schema: {
        summary: "Change user username",
        tags: ["users"],
        params: z.object({
          userId: z.string().uuid(),
        }),
        body: z.object({
          username: z.string().min(4),
        }),
      },
    },
    async (request, reply) => {
      const { userId } = request.params;
      const { username } = request.body;

      const existingUser = await prisma.user.findFirst({
        where: { username },
      });
      if (existingUser) throw new ClientError("Username already in use");

      const user = await prisma.user.update({
        where: { id: userId },
        data: { username },
      });

      // TODO: kill session

      return reply.send({ userId: user.id });
    }
  );
}
