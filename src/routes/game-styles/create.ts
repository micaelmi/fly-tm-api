import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../../lib/check-user-permissions";
import { ForbiddenError } from "../../errors/forbidden-error";

export async function createGameStyle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/game-styles",
    {
      schema: {
        summary: "Create a game style",
        tags: ["auxiliaries"],
        body: z.object({
          title: z.string(),
          description: z.string(),
        }),
        response: {
          201: z.object({
            gameStyleId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, description } = request.body;

      if (!isAdmin(request)) {
        throw new ForbiddenError(
          "This user is not allowed to create game styles"
        );
      }

      const gameStyle = await prisma.gameStyle.create({
        data: { title, description },
      });
      return reply.status(201).send({ gameStyleId: gameStyle.id });
    }
  );
}
