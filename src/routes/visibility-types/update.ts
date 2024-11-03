import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../../lib/check-user-permissions";
import { ForbiddenError } from "../../errors/forbidden-error";

export async function updateVisibilityType(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/visibility-types/:visibilityTypeId",
    {
      schema: {
        summary: "Update a visibility type",
        tags: ["auxiliaries"],
        params: z.object({
          visibilityTypeId: z.coerce.number(),
        }),
        body: z.object({
          description: z.string(),
        }),
        response: {
          200: z.object({
            visibilityTypeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { visibilityTypeId } = request.params;
      const { description } = request.body;

      if (!isAdmin(request)) {
        throw new ForbiddenError(
          "This user is not allowed to update visibility types"
        );
      }
      const visibilityType = await prisma.visibilityType.update({
        where: { id: visibilityTypeId },
        data: { description },
      });
      return reply.send({ visibilityTypeId: visibilityType.id });
    }
  );
}
