import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function deleteTraining(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/trainings/:trainingId",
    {
      schema: {
        summary: "Delete a training by id",
        tags: ["trainings"],
        params: z.object({
          trainingId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { trainingId } = request.params;
      const training = await prisma.training.delete({
        where: {
          id: trainingId,
        },
      });

      return reply.send({ training });
    }
  );
}
