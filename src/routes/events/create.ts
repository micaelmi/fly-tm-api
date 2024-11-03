import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
        summary: "Create an event",
        tags: ["events"],
        body: z.object({
          name: z.string().min(4),
          start_date: z.string().transform((str) => new Date(str)),
          end_date: z.string().transform((str) => new Date(str)),
          cep: z.string().optional(),
          state: z.string().optional(),
          city: z.string().optional(),
          neighborhood: z.string().optional(),
          street: z.string().optional(),
          address_number: z.number().int().optional(),
          complement: z.string().optional(),
          maps_url: z.string().optional(),
          description: z.string(),
          image_url: z.string(),
          price: z.string(),
          status: z.enum(["active", "inactive"]),
          level_id: z.number(),
          user_id: z.string().uuid(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        description,
        end_date,
        image_url,
        name,
        price,
        start_date,
        status,
        address_number,
        cep,
        city,
        complement,
        maps_url,
        neighborhood,
        state,
        street,
        level_id,
        user_id,
      } = request.body;

      const event = await prisma.event.create({
        data: {
          description,
          end_date,
          image_url,
          name,
          price,
          start_date,
          status,
          address_number,
          cep,
          city,
          complement,
          maps_url,
          neighborhood,
          state,
          street,
          level_id,
          user_id,
        },
      });
      return reply.status(201).send({ eventId: event.id });
    }
  );
}
