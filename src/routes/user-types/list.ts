import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";

export async function listUserTypes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/user-types",
    {
      schema: {
        summary: "List all user types",
        tags: ["auxiliaries", "users"],
      },
    },
    async (request, reply) => {
      const userTypes = await prisma.userType.findMany();

      return reply.send({ userTypes });
    }
  );
}
