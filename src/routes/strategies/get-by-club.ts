import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { BadRequest } from "../../errors/bad-request";

export async function getStrategiesByClub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/strategies/club/:clubId",
    {
      schema: {
        summary: "Get strategies by club",
        tags: ["strategies", "clubs"],
        params: z.object({
          clubId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { clubId } = request.params;
      const strategies = await prisma.strategy.findMany({
        where: { club_id: clubId },
        include: {
          strategy_items: {
            select: {
              description: true,
              movement: {
                select: {
                  average_time: true,
                  description: true,
                  image_url: true,
                  name: true,
                  video_url: true,
                },
              },
            },
          },
          user: {
            select: {
              name: true,
              username: true,
            },
          },
          level: {
            select: {
              title: true,
              description: true,
            },
          },
        },
      });
      if (strategies === null)
        throw new BadRequest("this club does not have any strategies");

      return reply.send({ strategies });
    }
  );
}
