import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export async function listGameStyles(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/game-styles",
    {
      schema: {
        summary: "List all game styles",
        tags: ["auxiliaries"],
      },
    },
    async (request, reply) => {
      const gameStyles = await prisma.gameStyle.findMany();

      return reply.send({ gameStyles });
    }
  );
}
