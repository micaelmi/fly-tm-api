import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export async function listHandGrips(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/hand-grips",
    {
      schema: {
        summary: "List all hand grips",
        tags: ["auxiliaries"],
      },
    },
    async (request, reply) => {
      const handGrips = await prisma.handGrip.findMany();

      return reply.send({ handGrips });
    }
  );
}
