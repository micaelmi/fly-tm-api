import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { BadRequest } from "../../errors/bad-request";
import { ForbiddenError } from "../../errors/forbidden-error";
import { isAdmin } from "../../lib/check-user-permissions";

export async function getContactsByUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/contacts/user/:userId",
    {
      schema: {
        summary: "Get contacts by owner",
        tags: ["contacts", "users"],
        params: z.object({
          userId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { userId } = request.params;
      const request_owner = request.user;
      if (
        !request_owner ||
        (request_owner.sub !== userId && !isAdmin(request))
      ) {
        throw new ForbiddenError(
          "This user is not allowed to see this contact"
        );
      }
      const contacts = await prisma.contact.findMany({
        where: { user_id: userId },
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

      if (contacts === null)
        throw new BadRequest("this user has not made any contact");

      return reply.send({ contacts });
    }
  );
}
