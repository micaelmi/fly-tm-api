import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function incrementTrainingDays(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/trainings/:userId/increment-training-days",
    {
      schema: {
        summary: "Increment the training days of an user",
        tags: ["trainings"],
        params: z.object({
          userId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { userId } = request.params;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          training_days: {
            increment: 1,
          },
        },
      });
      return reply.send({ userId: user.id, trainingDays: user.training_days });
    }
  );
}
