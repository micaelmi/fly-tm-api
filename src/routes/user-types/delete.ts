import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { ForbiddenError } from "../../errors/forbidden-error";
import { ClientError } from "../../errors/client-error";
import { isAdmin } from "../../lib/check-user-permissions";

export async function deleteUserType(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/user-types/:userTypeId",
    {
      schema: {
        summary: "Delete a user type by id",
        tags: ["auxiliaries", "users"],
        params: z.object({
          userTypeId: z.coerce.number(),
        }),
      },
    },
    async (request, reply) => {
      const { userTypeId } = request.params;

      const userType = await prisma.userType.findFirst({
        where: { id: userTypeId },
      });

      if (!userType) throw new ClientError("user type not found");

      if (!isAdmin(request)) {
        throw new ForbiddenError(
          "This user is not allowed to delete user types"
        );
      }

      const deleted_userType = await prisma.userType.delete({
        where: { id: userTypeId },
      });

      return reply.send({ userType: deleted_userType });
    }
  );
}
