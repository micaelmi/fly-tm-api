import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../../lib/check-user-permissions";
import { ForbiddenError } from "../../errors/forbidden-error";

export async function updateHandGrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/hand-grips/:handGripId",
    {
      schema: {
        summary: "Update a hand grip",
        tags: ["auxiliaries"],
        params: z.object({
          handGripId: z.coerce.number(),
        }),
        body: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
        }),
        response: {
          200: z.object({
            handGripId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { handGripId } = request.params;
      const { title, description } = request.body;

      if (!isAdmin(request)) {
        throw new ForbiddenError(
          "This user is not allowed to update hand grips"
        );
      }
      const handGrip = await prisma.handGrip.update({
        where: { id: handGripId },
        data: { title, description },
      });
      return reply.send({ handGripId: handGrip.id });
    }
  );
}
