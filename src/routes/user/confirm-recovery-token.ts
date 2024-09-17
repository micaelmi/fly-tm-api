import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ClientError } from "../../errors/client-error";
import { prisma } from "../../lib/prisma";
import { env } from "../../env";

export async function confirmRecoveryToken(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users/recover-account/confirm-recovery-token",
    {
      schema: {
        summary: "Confirm token to change password",
        tags: ["users"],
        querystring: z.object({
          token_number: z.string(),
          email: z.string().email(),
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { token_number, email, id } = request.query;

      const token = await prisma.token.findFirst({
        where: {
          number: Number(token_number),
          expiration: {
            gte: new Date(),
          },
          status: "active",
          user_email: email,
        },
      });

      if (!token) throw new ClientError("Token invalid");

      await prisma.token.update({
        data: { status: "inactive" },
        where: { id: token.id },
      });
      // redirect to change password page
      return reply.redirect(
        `${env.FRONTEND_BASE_URL}/recover-account/change-password?token=${token_number}&id=${id}&email=${email}`
      );
    }
  );
}
