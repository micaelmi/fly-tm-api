import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function createTraining(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trainings",
    {
      schema: {
        summary: "Create a training",
        tags: ["trainings"],
        body: z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          time: z.number(), // seconds
          icon_url: z.string().url(),
          user_id: z.string().uuid(),
          level_id: z.number(),
          visibility_type_id: z.number(),
          club_id: z.string().optional(),
          items: z.array(
            z.object({
              counting_mode: z.enum(["reps", "time"]),
              reps: z.number(),
              time: z.number(),
              queue: z.number(),
              comments: z.string().optional(),
              movement_id: z.number(),
            })
          ),
        }),
        response: {
          201: z.object({
            trainingId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        title,
        description,
        time,
        icon_url,
        user_id,
        level_id,
        visibility_type_id,
        club_id,
        items,
      } = request.body;

      const training = await prisma.training.create({
        data: {
          title,
          description,
          time,
          icon_url,
          user_id,
          level_id,
          visibility_type_id,
          club_id,
          training_items: {
            createMany: {
              data: items.map((item) => ({
                counting_mode: item.counting_mode,
                reps: item.reps,
                time: item.time,
                queue: item.queue,
                comments: item.comments,
                movement_id: item.movement_id,
              })),
            },
          },
        },
      });

      return reply.status(201).send({ trainingId: training.id });
    }
  );
}
