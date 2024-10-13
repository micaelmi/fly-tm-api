import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export async function listStrategies(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/strategies",
    {
      schema: {
        summary: "List all public strategies",
        tags: ["strategies"],
      },
    },
    async (request, reply) => {
      const strategies = await prisma.strategy.findMany({
        where: {
          visibility_type: {
            description: "Público",
          },
        },
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
        },
      });

      return reply.send({ strategies });
    }
  );
}
