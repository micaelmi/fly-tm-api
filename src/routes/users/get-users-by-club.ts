import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function getUsersByClub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users/club/:clubId",
    {
      schema: {
        summary: "List users by club",
        tags: ["users", "clubs"],
        params: z.object({
          clubId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { clubId } = request.params;
      const users = await prisma.user.findMany({
        where: { club_id: clubId },
      });
      return reply.send({ users: users });
    }
  );
}
