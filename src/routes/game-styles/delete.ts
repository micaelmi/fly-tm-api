import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { ForbiddenError } from "../../errors/forbidden-error";
import { ClientError } from "../../errors/client-error";
import { isAdmin } from "../../lib/check-user-permissions";

export async function deleteGameStyle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/game-styles/:gameStyleId",
    {
      schema: {
        summary: "Delete a game style by id",
        tags: ["auxiliaries"],
        params: z.object({
          gameStyleId: z.coerce.number(),
        }),
      },
    },
    async (request, reply) => {
      const { gameStyleId } = request.params;

      const gameStyle = await prisma.gameStyle.findFirst({
        where: { id: gameStyleId },
      });

      if (!gameStyle) throw new ClientError("game style not found");

      if (!isAdmin(request)) {
        throw new ForbiddenError(
          "This user is not allowed to delete game styles"
        );
      }

      const deleted_gameStyle = await prisma.gameStyle.delete({
        where: { id: gameStyleId },
      });

      return reply.send({ gameStyle: deleted_gameStyle });
    }
  );
}
