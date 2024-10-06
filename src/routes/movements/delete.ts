import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function deleteMovement(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/movements/:movementId",
    {
      schema: {
        summary: "Delete a movement by id",
        tags: ["trainings", "strategies"],
        params: z.object({
          movementId: z.number(),
        }),
      },
    },
    async (request, reply) => {
      const { movementId } = request.params;
      const movement = await prisma.movement.delete({
        where: {
          id: movementId,
        },
      });

      return reply.send({ movement });
    }
  );
}
