import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export async function listTrainings(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trainings",
    {
      schema: {
        summary: "List all public trainings",
        tags: ["trainings"],
      },
    },
    async (request, reply) => {
      const trainings = await prisma.training.findMany({
        where: {
          visibility_type: {
            description: "público",
          },
        },
        include: {
          training_items: {
            select: {
              comments: true,
              counting_mode: true,
              reps: true,
              time: true,
              queue: true,
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

      return reply.send({ trainings });
    }
  );
}
