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
    async (request, reply) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const events = await prisma.event.findMany({
        where: {
          status: "active",
          end_date: {
            gte: today,
          },
        },
        include: {
          level: {
            select: {
              title: true,
              description: true,
            },
          },
          user: {
            select: {
              username: true,
            },
          },
        },
      });

      return reply.send({ events });
    }
  );
}
