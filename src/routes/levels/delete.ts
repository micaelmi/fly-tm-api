import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { ForbiddenError } from "../../errors/forbidden-error";
import { ClientError } from "../../errors/client-error";
import { isAdmin } from "../../lib/check-user-permissions";

export async function deleteLevel(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/levels/:levelId",
    {
      schema: {
        summary: "Delete a level by id",
        tags: ["auxiliaries"],
        params: z.object({
          levelId: z.coerce.number(),
        }),
      },
    },
    async (request, reply) => {
      const { levelId } = request.params;

      const level = await prisma.level.findFirst({
        where: { id: levelId },
      });

      if (!level) throw new ClientError("level not found");

      if (!isAdmin(request)) {
        throw new ForbiddenError("This user is not allowed to delete levels");
      }

      const deleted_level = await prisma.level.delete({
        where: { id: levelId },
      });

      return reply.send({ level: deleted_level });
    }
  );
}
