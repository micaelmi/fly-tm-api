import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function updateEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/events/:eventId",
    {
      schema: {
        summary: "Update an event",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string().min(4).optional(),
          start_date: z
            .string()
            .transform((str) => new Date(str))
            .optional(),
          end_date: z
            .string()
            .transform((str) => new Date(str))
            .optional(),
          cep: z.string().optional(),
          state: z.string().optional(),
          city: z.string().optional(),
          neighborhood: z.string().optional(),
          street: z.string().optional(),
          address_number: z.number().int().optional(),
          complement: z.string().optional(),
          maps_url: z.string().optional(),
          level_id: z.number().optional(),
          description: z.string().optional(),
          image_url: z.string().optional(),
          price: z.string().optional(),
          status: z.enum(["active", "inactive"]).optional(),
        }),
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const {
        description,
        end_date,
        image_url,
        level_id,
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
      } = request.body;

      const event = await prisma.event.update({
        where: { id: eventId },
        data: {
          description,
          end_date,
          image_url,
          level_id,
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
        },
      });
      return reply.send({ eventId: event.id });
    }
  );
}
