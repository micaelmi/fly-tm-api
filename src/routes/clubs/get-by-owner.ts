import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";

export async function getClubsByOwner(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/clubs/user/:owner_username",
    {
      schema: {
        summary: "Get clubs by owner",
        tags: ["clubs"],
        params: z.object({
          owner_username: z.string().min(4),
        }),
      },
    },
    async (request, reply) => {
      const { owner_username } = request.params;
      const clubs = await prisma.club.findMany({
        where: { owner_username },
      });

      return reply.send({ clubs });
    }
  );
}
