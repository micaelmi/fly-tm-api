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

      // se existir algum usuário com esse username, não permite
      const existingUser = await prisma.user.findFirst({
        where: { username },
      });
      if (existingUser) throw new ClientError("Username already in use");

      // busca o username anterior do usuário
      const user = await prisma.user.findFirst({
        where: { id: userId },
        select: { username: true },
      });
      if (!user) throw new ClientError("User not found");

      // atualiza o username do usuário
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { username },
      });

      // atualiza o username do dono do clube, de acordo com o anterior para o novo
      await prisma.club.updateMany({
        data: {
          owner_username: username,
        },
        where: {
          owner_username: user.username,
        },
      });

      return reply.send({ userId: updatedUser.id });
    }
  );
}
