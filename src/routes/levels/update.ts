import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../../lib/check-user-permissions";
import { ForbiddenError } from "../../errors/forbidden-error";

export async function updateLevel(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/levels/:levelId",
    {
      schema: {
        summary: "Update a level",
        tags: ["auxiliaries"],
        params: z.object({
          levelId: z.coerce.number(),
        }),
        body: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
        }),
        response: {
          200: z.object({
            levelId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { levelId } = request.params;
      const { title, description } = request.body;

      if (!isAdmin(request)) {
        throw new ForbiddenError("This user is not allowed to update levels");
      }
      const level = await prisma.level.update({
        where: { id: levelId },
        data: { title, description },
      });
      return reply.send({ levelId: level.id });
    }
  );
}
