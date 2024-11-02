import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { isAdmin } from "../../lib/check-user-permissions";
import { ForbiddenError } from "../../errors/forbidden-error";

export async function updateUserType(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/user-types/:userTypeId",
    {
      schema: {
        summary: "Update an user type",
        tags: ["auxiliaries", "users"],
        params: z.object({
          userTypeId: z.coerce.number(),
        }),
        body: z.object({
          description: z.string(),
        }),
        response: {
          200: z.object({
            userTypeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { userTypeId } = request.params;
      const { description } = request.body;

      if (!isAdmin(request)) {
        throw new ForbiddenError(
          "This user is not allowed to update user types"
        );
      }
      const userType = await prisma.userType.update({
        where: { id: userTypeId },
        data: { description },
      });
      return reply.send({ userTypeId: userType.id });
    }
  );
}
