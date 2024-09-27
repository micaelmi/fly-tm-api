import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { BadRequest } from "../../errors/bad-request";

export async function getEventById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId",
    {
      schema: {
        summary: "Get event by id",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const event = await prisma.event.findFirst({
        where: { id: eventId },
        include: {
          user: true,
        },
      });
      if (event === null) throw new BadRequest("Event not found");

      return reply.send({ event });
    }
  );
}
