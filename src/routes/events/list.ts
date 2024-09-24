import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export async function listEvents(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events",
    {
      schema: {
        summary: "List active events",
        tags: ["events"],
      },
    },
    async (request) => {
      const events = await prisma.event.findMany({
        where: {
          status: "active",
          show_date: {
            lte: new Date(),
          },
          hide_date: {
            gte: new Date(),
          },
        },
      });

      return { events };
    }
  );
}
