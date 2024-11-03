import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export async function listVisibilityTypes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/visibility-types",
    {
      schema: {
        summary: "List all visibility types",
        tags: ["auxiliaries"],
      },
    },
    async (request, reply) => {
      const visibilityTypes = await prisma.visibilityType.findMany();

      return reply.send({ visibilityTypes });
    }
  );
}
