import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../../lib/check-user-permissions";
import { ForbiddenError } from "../../errors/forbidden-error";

export async function createVisibilityType(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/visibility-types",
    {
      schema: {
        summary: "Create a visibility type",
        tags: ["auxiliaries"],
        body: z.object({
          description: z.string(),
        }),
        response: {
          201: z.object({
            visibilityTypeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { description } = request.body;

      if (!isAdmin(request)) {
        throw new ForbiddenError(
          "This user is not allowed to create visibility types"
        );
      }

      const visibilityType = await prisma.visibilityType.create({
        data: { description },
      });
      return reply.status(201).send({ visibilityTypeId: visibilityType.id });
    }
  );
}
