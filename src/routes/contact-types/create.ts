import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../../lib/check-user-permissions";
import { ForbiddenError } from "../../errors/forbidden-error";

export async function createContactType(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/contact-types",
    {
      schema: {
        summary: "Create a contact type",
        tags: ["auxiliaries", "contacts"],
        body: z.object({
          description: z.string(),
        }),
        response: {
          201: z.object({
            contactTypeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { description } = request.body;

      if (!isAdmin(request)) {
        throw new ForbiddenError(
          "This user is not allowed to create contact types"
        );
      }

      const contactType = await prisma.contactType.create({
        data: { description },
      });
      return reply.status(201).send({ contactTypeId: contactType.id });
    }
  );
}
