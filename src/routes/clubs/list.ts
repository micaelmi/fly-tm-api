import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export async function listClubs(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/clubs",
    {
      schema: {
        summary: "List all clubs",
        tags: ["clubs"],
      },
    },
    async (request, reply) => {
      const clubs = await prisma.club.findMany({
        include: {
          users: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
          _count: {
            select: { users: true },
          },
        },
      });

      return reply.send({ clubs });
    }
  );
}
