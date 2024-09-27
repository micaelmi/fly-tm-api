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
      const clubs = await prisma.club.findMany();

      return reply.send({ clubs });
    }
  );
}
