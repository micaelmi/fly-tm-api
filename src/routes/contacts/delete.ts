import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { ForbiddenError } from "../../errors/forbidden-error";
import { ClientError } from "../../errors/client-error";
import { isAdmin } from "../../lib/check-user-permissions";

export async function deleteContact(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/contacts/:contactId",
    {
      schema: {
        summary: "Delete a contact by id",
        tags: ["contacts"],
        params: z.object({
          contactId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { contactId } = request.params;

      const contact = await prisma.contact.findFirst({
        where: { id: contactId },
      });

      if (!contact) throw new ClientError("Contact not found");

      const request_owner = request.user;
      if (
        !request_owner ||
        (!isAdmin(request) && request_owner.sub !== contact.user_id)
      ) {
        throw new ForbiddenError(
          "This user is not allowed to delete this contact"
        );
      }

      const deleted_contact = await prisma.contact.delete({
        where: { id: contactId },
      });

      return reply.send({ contact: deleted_contact });
    }
  );
}
