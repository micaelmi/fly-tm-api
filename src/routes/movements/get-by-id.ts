import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { BadRequest } from "../../errors/bad-request";

export async function getMovementById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/movements/:movementId",
    {
      schema: {
        summary: "Get movement by id",
        tags: ["trainings", "strategies"],
        params: z.object({
          movementId: z.coerce.number(),
        }),
      },
    },
    async (request, reply) => {
      const { movementId } = request.params;
      const movement = await prisma.movement.findFirst({
        where: { id: movementId },
      });
      if (movement === null) throw new BadRequest("movement not found");

      return reply.send({ movement });
    }
  );
}
