import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { BadRequest } from "../../errors/bad-request";

export async function getTrainingById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trainings/:trainingId",
    {
      schema: {
        summary: "Get training by id",
        tags: ["trainings"],
        params: z.object({
          trainingId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { trainingId } = request.params;
      const training = await prisma.training.findFirst({
        where: { id: trainingId },
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
          level: {
            select: {
              title: true,
              description: true,
            },
          },
        },
      });
      if (training === null) throw new BadRequest("training not found");

      return reply.send({ training });
    }
  );
}
