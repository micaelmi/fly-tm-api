import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { BadRequest } from "../../errors/bad-request";
import { ForbiddenError } from "../../errors/forbidden-error";
import { isAdmin } from "../../lib/check-user-permissions";

export async function getContactsById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/contacts/:contactId",
    {
      schema: {
        summary: "Get contact by id",
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
        include: {
          contact_type: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      });

      if (contact === null)
        throw new BadRequest("this user has not made any contact");

      const request_owner = request.user;
      if (
        !request_owner ||
        (request_owner.sub !== contact.user_id && !isAdmin(request))
      ) {
        throw new ForbiddenError(
          "This user is not allowed to see this contact"
        );
      }

      return reply.send({ contact });
    }
  );
}
