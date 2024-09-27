import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function getEventsByOwner(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/user/:userId",
    {
      schema: {
        summary: "Get events by owner",
        tags: ["events"],
        params: z.object({
          userId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { userId } = request.params;
      const events = await prisma.event.findMany({
        where: { user_id: userId },
      });

      return reply.send({ events });
    }
  );
}
