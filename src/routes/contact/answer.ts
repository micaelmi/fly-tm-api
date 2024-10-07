import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import nodemailer from "nodemailer";
import { getMailClient } from "../../lib/mail";
import { ClientError } from "../../errors/client-error";
import { ForbiddenError } from "../../errors/forbidden-error";
import { isAdmin } from "../../lib/check-user-permissions";

export async function answerContact(app: FastifyInstance) {
  // it needs to be an administrator to answer a contact
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/contacts/:contactId",
    {
      schema: {
        summary: "Create a contact",
        tags: ["contacts"],
        params: z.object({
          contactId: z.string().uuid(),
        }),
        body: z.object({
          answer: z.string(),
        }),
        response: {
          200: z.object({
            contactId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { contactId } = request.params;
      const { answer } = request.body;

      const request_owner = request.user;

      if (!request_owner || !isAdmin(request)) {
        throw new ForbiddenError("Only administrators can answer contacts");
      }

      const contact = await prisma.contact.update({
        where: { id: contactId },
        data: { answer, status: "inactive" },
        select: {
          id: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
      if (!contact) throw new ClientError("Contact could not be updated");

      // send confirmation email
      const userFirstName = contact.user.name.split(" ")[0];
      const mail = await getMailClient();
      const message = await mail.sendMail({
        from: {
          name: "Equipe Fly TM",
          address: "suporte@flytm.com.br",
        },
        to: {
          name: userFirstName,
          address: contact.user.email,
        },
        subject: `Fly TM | Seu contato foi respondido!`,
        html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 2rem auto; background-color: #161F30; color: #FFFFFF; padding: 1rem; border-radius: 0.5rem">
          <h1>Olá, ${userFirstName}</h1>
          <p>Seu contato foi respondido! Entre na plataforma para ver a resposta.</p>

          <a href="https://flytm.com.br" style="text-decoration: none; margin: 1rem 0; font-weight: bold;">
          Acessar a plataforma
          </a>

          <p>A equipe Fly TM agradece seu contato, estamos sempre de portas abertas para você </p>
        </div>`.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return reply.send({ contactId: contact.id });
    }
  );
}
