import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function deleteEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/events/:eventId",
    {
      schema: {
        summary: "Delete an event by id",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { eventId } = request.params;
      const event = await prisma.event.delete({
        where: {
          id: eventId,
        },
      });

      return { event };
    }
  );
}
