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
          name: z.string().min(4),
          date: z.string().transform((str) => new Date(str)),
          show_date: z.string().transform((str) => new Date(str)),
          hide_date: z.string().transform((str) => new Date(str)),
          cep: z.string().optional(),
          state: z.string().optional(),
          city: z.string().optional(),
          neighborhood: z.string().optional(),
          street: z.string().optional(),
          address_number: z.number().int().optional(),
          complement: z.string().optional(),
          maps_url: z.string().optional(),
          level: z.string(),
          description: z.string(),
          image_url: z.string().url(),
          price: z.string(),
          status: z.enum(["active", "inactive"]),
        }),
      },
    },
    async (request) => {
      const { eventId } = request.params;
      const {
        date,
        description,
        hide_date,
        image_url,
        level,
        name,
        price,
        show_date,
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
          date,
          description,
          hide_date,
          image_url,
          level,
          name,
          price,
          show_date,
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
      return { eventId: event.id };
    }
  );
}
