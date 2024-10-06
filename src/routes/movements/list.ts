import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export async function listMovements(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/movements",
    {
      schema: {
        summary: "List all movements",
        tags: ["trainings", "strategies"],
      },
    },
    async (request, reply) => {
      const movements = await prisma.movement.findMany();

      return reply.send({ movements });
    }
  );
}
