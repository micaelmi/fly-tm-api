import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function updateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/users/:userId",
    {
      schema: {
        summary: "Update an user",
        tags: ["users"],
        params: z.object({
          userId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string().min(4).optional(),
          email: z.string().email().optional(),
          bio: z.string().optional().optional(),
          state: z.string().optional().optional(),
          city: z.string().optional().optional(),
          instagram: z.string().optional(),
          image_url: z.string().optional().optional(),
          status: z.enum(["active", "inactive"]).optional(),
          level_id: z.number().optional().optional(),
          game_style_id: z.number().optional().optional(),
          club_id: z.string().optional().optional(),
          hand_grip_id: z.number().optional().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { userId } = request.params;
      const {
        name,
        email,
        bio,
        state,
        city,
        instagram,
        image_url,
        status,
        level_id,
        game_style_id,
        club_id,
        hand_grip_id,
      } = request.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          email,
          bio,
          state,
          city,
          instagram,
          image_url,
          status,
          level_id,
          game_style_id,
          club_id,
          hand_grip_id,
        },
      });
      return reply.send({ userId: user.id });
    }
  );
}
