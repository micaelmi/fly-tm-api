import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../../lib/check-user-permissions";
import { ForbiddenError } from "../../errors/forbidden-error";

export async function updateGameStyle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/game-styles/:gameStyleId",
    {
      schema: {
        summary: "Update a game style",
        tags: ["auxiliaries"],
        params: z.object({
          gameStyleId: z.coerce.number(),
        }),
        body: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
        }),
        response: {
          200: z.object({
            gameStyleId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { gameStyleId } = request.params;
      const { title, description } = request.body;

      if (!isAdmin(request)) {
        throw new ForbiddenError(
          "This user is not allowed to update game styles"
        );
      }
      const gameStyle = await prisma.gameStyle.update({
        where: { id: gameStyleId },
        data: { title, description },
      });
      return reply.send({ gameStyleId: gameStyle.id });
    }
  );
}
