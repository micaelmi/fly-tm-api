import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function updateMovement(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/movements/:movementId",
    {
      schema: {
        summary: "Update a movement",
        tags: ["trainings", "strategies"],
        params: z.object({
          movementId: z.number(),
        }),
        body: z.object({
          name: z.string(),
          description: z.string(),
          average_time: z.number(), // seconds
          video_url: z.string().url(),
          image_url: z.string().url(),
        }),
        response: {
          200: z.object({
            movementId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { movementId } = request.params;
      const { name, description, average_time, video_url, image_url } =
        request.body;

      const movement = await prisma.movement.update({
        where: { id: movementId },
        data: {
          name,
          description,
          average_time,
          video_url,
          image_url,
        },
      });
      return reply.send({ movementId: movement.id });
    }
  );
}
