import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { BadRequest } from "../../errors/bad-request";

export async function getTrainingsByOwner(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trainings/user/:userId",
    {
      schema: {
        summary: "Get trainings by owner",
        tags: ["trainings", "users"],
        params: z.object({
          userId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { userId } = request.params;
      const trainings = await prisma.training.findMany({
        where: { user_id: userId },
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

      if (trainings === null)
        throw new BadRequest("this user does not own any trainings");

      return reply.send({ trainings });
    }
  );
}
