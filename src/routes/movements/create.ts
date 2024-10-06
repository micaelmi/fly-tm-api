import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function createMovement(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/movements",
    {
      schema: {
        summary: "Create a movement",
        tags: ["trainings", "strategies"],
        body: z.object({
          name: z.string(),
          description: z.string(),
          average_time: z.number(), // seconds
          video_url: z.string().url(),
          image_url: z.string().url(),
        }),
        response: {
          201: z.object({
            movementId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, description, average_time, video_url, image_url } =
        request.body;

      const movement = await prisma.movement.create({
        data: {
          name,
          description,
          average_time,
          video_url,
          image_url,
        },
      });
      return reply.status(201).send({ movementId: movement.id });
    }
  );
}
