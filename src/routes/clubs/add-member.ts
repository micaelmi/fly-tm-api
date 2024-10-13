import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ClientError } from "../../errors/client-error";
import { prisma } from "../../lib/prisma";
import { BadRequest } from "../../errors/bad-request";

export async function addMemberToClub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/clubs/:clubId/add-member",
    {
      schema: {
        summary: "Add member to club",
        tags: ["clubs", "users"],
        params: z.object({
          clubId: z.string().uuid(),
        }),
        body: z.object({
          username: z.string().min(4),
        }),
      },
    },
    async (request, reply) => {
      const { clubId } = request.params;
      const { username } = request.body;

      const existingUser = await prisma.user.findFirst({
        where: { username },
      });
      if (!existingUser) throw new ClientError("User not found");

      const club = await prisma.club.findFirst({
        where: { id: clubId },
        select: {
          max_members: true,
          _count: {
            select: { users: true },
          },
        },
      });

      if (!club || club.max_members >= club._count.users)
        throw new BadRequest("Club is already full");

      const user = await prisma.user.update({
        where: { username },
        data: { club_id: clubId },
      });

      return reply.send({ userId: user.id });
    }
  );
}
