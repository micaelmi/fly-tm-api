import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { BadRequest } from "../../errors/bad-request";

export async function getUserByUsername(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users/:username",
    {
      schema: {
        summary: "Get user by username",
        tags: ["users"],
        params: z.object({
          username: z.string().min(4),
        }),
      },
    },
    async (request, reply) => {
      const request_owner = request.user.username;

      const { username } = request.params;
      const user = await prisma.user.findFirst({
        where: { username, status: "active" },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          bio: true,
          created_at: true,
          training_days: true,
          state: true,
          city: true,
          instagram: true,
          image_url: true,
          user_type: true,
          level: true,
          game_style: true,
          club: true,
          hand_grip: true,

          credits: request_owner === username,
        },
      });
      if (user === null) throw new BadRequest("user not found");

      return reply.send({ user });
    }
  );
}
