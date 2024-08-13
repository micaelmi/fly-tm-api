import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ClientError } from "../../errors/client-error";
import { prisma } from "../../lib/prisma";

export async function confirmEmail(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users/register/confirm-email",
    {
      schema: {
        summary: "Confirm user email to create account",
        tags: ["users"],
        querystring: z.object({
          user_id: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { user_id } = request.query;

      const existingUser = await prisma.user.findFirst({
        select: { id: true },
        where: { id: user_id },
      });

      if (!existingUser) throw new ClientError("User does not exist");

      const user = await prisma.user.update({
        data: {
          status: "active",
        },
        where: { id: user_id },
      });

      return { userId: user.id };
    }
  );
}
