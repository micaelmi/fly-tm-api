import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { ForbiddenError } from "../../errors/forbidden-error";
import { ClientError } from "../../errors/client-error";
import { isAdmin } from "../../lib/check-user-permissions";

export async function deleteContactType(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/contact-types/:contactTypeId",
    {
      schema: {
        summary: "Delete a contact type by id",
        tags: ["auxiliaries", "contacts"],
        params: z.object({
          contactTypeId: z.coerce.number(),
        }),
      },
    },
    async (request, reply) => {
      const { contactTypeId } = request.params;

      const contactType = await prisma.contactType.findFirst({
        where: { id: contactTypeId },
      });

      if (!contactType) throw new ClientError("contact type not found");

      if (!isAdmin(request)) {
        throw new ForbiddenError(
          "This user is not allowed to delete contact types"
        );
      }

      const deleted_contactType = await prisma.contactType.delete({
        where: { id: contactTypeId },
      });

      return reply.send({ contactType: deleted_contactType });
    }
  );
}
