import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { BadRequest } from "../../errors/bad-request";

export async function getClubById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/clubs/:clubId",
    {
      schema: {
        summary: "Get club by id",
        tags: ["clubs"],
        params: z.object({
          clubId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { clubId } = request.params;
      const club = await prisma.club.findFirst({
        where: { id: clubId },
      });
      if (club === null) throw new BadRequest("Club not found");

      return reply.send({ club });
    }
  );
}
