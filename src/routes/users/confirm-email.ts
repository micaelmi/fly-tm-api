import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ClientError } from "../../errors/client-error";
import { prisma } from "../../lib/prisma";
import { dayjs } from "../../lib/dayjs";
import { env } from "../../env";

export async function confirmEmail(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users/confirm-email",
    {
      schema: {
        summary: "Confirm user email to create account",
        tags: ["users"],
        querystring: z.object({
          user_id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { user_id } = request.query;

      const existingUser = await prisma.unconfirmedUser.findFirst({
        where: { id: user_id },
      });

      if (!existingUser) throw new ClientError("User does not exist");

      if (
        dayjs(existingUser.created_at).isBefore(dayjs().subtract(15, "minute"))
      ) {
        await prisma.unconfirmedUser.delete({
          where: { id: existingUser.id },
        });
        throw new ClientError("Register expired");
      }

      const user = await prisma.user.create({
        data: {
          name: existingUser.name,
          username: existingUser.username,
          email: existingUser.email,
          password: existingUser.password,
          user_type_id: existingUser.user_type_id,
        },
      });
      await prisma.unconfirmedUser.delete({
        where: { id: existingUser.id },
      });
      return reply.redirect(
        `${env.FRONTEND_BASE_URL}/register/confirm-email?userId=${user.id}&status=confirmed`
      );
    }
  );
}
