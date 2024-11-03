import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export async function listContactTypes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/contact-types",
    {
      schema: {
        summary: "List all contact types",
        tags: ["auxiliaries", "contacts"],
      },
    },
    async (request, reply) => {
      const contactTypes = await prisma.contactType.findMany();

      return reply.send({ contactTypes });
    }
  );
}
