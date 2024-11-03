import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { BadRequest } from "../../errors/bad-request";

export async function getEventsByOwner(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/user/:userId",
    {
      schema: {
        summary: "Get events by owner",
        tags: ["events", "users"],
        params: z.object({
          userId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { userId } = request.params;
      const events = await prisma.event.findMany({
        where: { user_id: userId },
        include: {
          level: {
            select: {
              title: true,
              description: true,
            },
          },
          user: {
            select: {
              name: true,
              username: true,
            },
          },
        },
      });

      if (events === null)
        throw new BadRequest("this user does not own any events");

      return reply.send({ events });
    }
  );
}
