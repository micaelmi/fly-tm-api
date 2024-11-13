import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function createStrategy(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/strategies",
    {
      schema: {
        summary: "Create a strategy",
        tags: ["strategies"],
        body: z.object({
          title: z.string().min(1),
          how_it_works: z.string(),
          against_whom: z.string(),
          icon_url: z.string().url(),
          user_id: z.string().uuid(),
          level_id: z.number(),
          visibility_type_id: z.number(),
          club_id: z.string().optional(),
          items: z.array(
            z.object({
              description: z.string(),
              movement_id: z.number(),
            })
          ),
        }),
        response: {
          201: z.object({
            strategyId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        title,
        how_it_works,
        against_whom,
        icon_url,
        user_id,
        level_id,
        visibility_type_id,
        club_id,
        items,
      } = request.body;

      const strategy = await prisma.strategy.create({
        data: {
          title,
          how_it_works,
          against_whom,
          icon_url,
          user_id,
          level_id,
          visibility_type_id,
          club_id,
          strategy_items: {
            createMany: {
              data: items.map((item) => ({
                description: item.description,
                movement_id: item.movement_id,
              })),
            },
          },
        },
      });

      return reply.status(201).send({ strategyId: strategy.id });
    }
  );
}
