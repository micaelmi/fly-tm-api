import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { BadRequest } from "../../errors/bad-request";

export async function getTrainingsByClub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trainings/club/:clubId",
    {
      schema: {
        summary: "Get trainings by club",
        tags: ["trainings", "clubs"],
        params: z.object({
          clubId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { clubId } = request.params;
      const trainings = await prisma.training.findMany({
        where: { club_id: clubId },
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
        throw new BadRequest("this club does not have any trainings");

      return reply.send({ training: trainings });
    }
  );
}
