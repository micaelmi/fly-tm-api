import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export async function listLevels(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/levels",
    {
      schema: {
        summary: "List all levels",
        tags: ["auxiliaries"],
      },
    },
    async (request, reply) => {
      const levels = await prisma.level.findMany();

      return reply.send({ levels });
    }
  );
}
