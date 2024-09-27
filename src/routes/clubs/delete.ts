import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function deleteClub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/clubs/:clubId",
    {
      schema: {
        summary: "Delete a club by id",
        tags: ["clubs"],
        params: z.object({
          clubId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { clubId } = request.params;
      const club = await prisma.club.delete({
        where: {
          id: clubId,
        },
      });

      return reply.send({ club });
    }
  );
}
