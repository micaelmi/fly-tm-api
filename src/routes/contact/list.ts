import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import { ForbiddenError } from "../../errors/forbidden-error";
import { isAdmin } from "../../lib/check-user-permissions";

export async function listContacts(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/contacts",
    {
      schema: {
        summary: "List all contacts",
        tags: ["contacts"],
      },
    },
    async (request, reply) => {
      const request_owner = request.user;
      if (!request_owner || !isAdmin(request)) {
        throw new ForbiddenError("Only administrators can access contacts");
      }

      const contacts = await prisma.contact.findMany({
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
        orderBy: [{ status: "asc", created_at: "desc" }],
      });

      return reply.send({ contacts });
    }
  );
}
