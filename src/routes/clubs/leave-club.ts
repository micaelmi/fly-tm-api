import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ClientError } from "../../errors/client-error";
import { prisma } from "../../lib/prisma";
import { BadRequest } from "../../errors/bad-request";
import { isAdmin } from "../../lib/check-user-permissions";
import { ForbiddenError } from "../../errors/forbidden-error";

export async function leaveClub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/clubs/:clubId/leave/:userId",
    {
      schema: {
        summary: "Leave the club",
        tags: ["clubs", "users"],
        params: z.object({
          clubId: z.string().uuid(),
          userId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { clubId, userId } = request.params;

      const club_owner = await prisma.club.findFirst({
        where: { id: clubId },
        select: {
          owner_username: true,
        },
      });

      const request_owner = request.user;

      if (
        !request_owner ||
        !club_owner ||
        (club_owner?.owner_username !== request_owner.username &&
          request_owner.sub !== userId &&
          !isAdmin(request))
      ) {
        throw new ForbiddenError(
          "This user is not allowed to access this route"
        );
      }
      // apenas um admin ou a própria pessoa ou o dono do clube podem remover um usuário

      const user = await prisma.user.update({
        where: { id: userId },
        data: { club_id: null },
      });

      if (!user) throw new ClientError("User could not be updated");

      return reply.send({ userId: user.id });
    }
  );
}
