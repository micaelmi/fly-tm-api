import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../../lib/check-user-permissions";
import { ForbiddenError } from "../../errors/forbidden-error";

export async function updateContactType(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/contact-types/:contactTypeId",
    {
      schema: {
        summary: "Update a contact type",
        tags: ["auxiliaries", "contacts"],
        params: z.object({
          contactTypeId: z.coerce.number(),
        }),
        body: z.object({
          description: z.string(),
        }),
        response: {
          200: z.object({
            contactTypeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { contactTypeId } = request.params;
      const { description } = request.body;

      if (!isAdmin(request)) {
        throw new ForbiddenError(
          "This user is not allowed to update contact types"
        );
      }
      const contactType = await prisma.contactType.update({
        where: { id: contactTypeId },
        data: { description },
      });
      return reply.send({ contactTypeId: contactType.id });
    }
  );
}
