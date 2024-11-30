import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function createClub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/clubs",
    {
      schema: {
        summary: "Create a club",
        tags: ["clubs"],
        body: z.object({
          name: z.string(),
          description: z.string(),
          logo_url: z.string().url(),
          background: z.string(),
          owner_username: z.string(),
          email: z.string().email(),
          phone: z.string().optional(),
          instagram: z.string().optional(),
          other_contacts: z.string().optional(),
          schedule: z.string(),
          prices: z.string(),
          cep: z.string(),
          state: z.string(),
          city: z.string(),
          neighborhood: z.string(),
          street: z.string(),
          address_number: z.number().optional(),
          complement: z.string().optional(),
          maps_url: z.string().url(),
          max_members: z.number().optional(),
        }),
        response: {
          201: z.object({
            clubId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        name,
        description,
        logo_url,
        background,
        owner_username,
        email,
        phone,
        instagram,
        other_contacts,
        schedule,
        prices,
        cep,
        state,
        city,
        neighborhood,
        street,
        address_number,
        complement,
        maps_url,
        max_members,
      } = request.body;

      const club = await prisma.club.create({
        data: {
          name,
          description,
          logo_url,
          background,
          owner_username,
          email,
          phone,
          instagram,
          other_contacts,
          schedule,
          prices,
          cep,
          state,
          city,
          neighborhood,
          street,
          address_number,
          complement,
          maps_url,
          max_members,
        },
      });
      await prisma.user.update({
        where: { username: owner_username },
        data: {
          club_id: club.id,
        },
      });
      return reply.status(201).send({ clubId: club.id });
    }
  );
}
