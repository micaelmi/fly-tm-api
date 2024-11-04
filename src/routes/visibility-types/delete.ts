import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { ForbiddenError } from "../../errors/forbidden-error";
import { ClientError } from "../../errors/client-error";
import { isAdmin } from "../../lib/check-user-permissions";

export async function deleteVisibilityType(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/visibility-types/:visibilityTypeId",
    {
      schema: {
        summary: "Delete a visibility type by id",
        tags: ["auxiliaries"],
        params: z.object({
          visibilityTypeId: z.coerce.number(),
        }),
      },
    },
    async (request, reply) => {
      const { visibilityTypeId } = request.params;

      const visibilityType = await prisma.visibilityType.findFirst({
        where: { id: visibilityTypeId },
      });

      if (!visibilityType) throw new ClientError("visibility type not found");

      if (!isAdmin(request)) {
        throw new ForbiddenError(
          "This user is not allowed to delete visibility types"
        );
      }

      const deleted_visibilityType = await prisma.visibilityType.delete({
        where: { id: visibilityTypeId },
      });

      return reply.send({ visibilityType: deleted_visibilityType });
    }
  );
}
