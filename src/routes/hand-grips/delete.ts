import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { ForbiddenError } from "../../errors/forbidden-error";
import { ClientError } from "../../errors/client-error";
import { isAdmin } from "../../lib/check-user-permissions";

export async function deleteHandGrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/hand-grips/:handGripId",
    {
      schema: {
        summary: "Delete a hand grip by id",
        tags: ["auxiliaries"],
        params: z.object({
          handGripId: z.coerce.number(),
        }),
      },
    },
    async (request, reply) => {
      const { handGripId } = request.params;

      const handGrip = await prisma.handGrip.findFirst({
        where: { id: handGripId },
      });

      if (!handGrip) throw new ClientError("hand grip not found");

      if (!isAdmin(request)) {
        throw new ForbiddenError(
          "This user is not allowed to delete hand grips"
        );
      }

      const deleted_handGrip = await prisma.handGrip.delete({
        where: { id: handGripId },
      });

      return reply.send({ handGrip: deleted_handGrip });
    }
  );
}
