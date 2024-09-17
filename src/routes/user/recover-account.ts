import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from "nodemailer";
import z from "zod";
import { env } from "../../env";
import { ClientError } from "../../errors/client-error";
import { getMailClient } from "../../lib/mail";
import { prisma } from "../../lib/prisma";

export async function recoverAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users/recover-account",
    {
      schema: {
        summary: "Recover account",
        tags: ["users"],
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request) => {
      const { email } = request.body;

      const user = await prisma.user.findFirst({
        select: { id: true, name: true, email: true },
        where: { email },
      });

      if (!user) throw new ClientError("Email not registered");

      const tokenNumber = Math.floor(Math.random() * 9000) + 1000;
      const currentDate = new Date();
      const minutes = 15 * (60 * 1000);
      const expiration = new Date(currentDate.getTime() + minutes);

      const token = await prisma.token.create({
        data: {
          number: tokenNumber,
          user_email: user.email,
          expiration,
        },
      });

      const userFirstName = user.name.split(" ")[0];
      const apiBaseUrl = env.API_BASE_URL;

      const mail = await getMailClient();
      const message = await mail.sendMail({
        from: {
          name: "Equipe Fly TM",
          address: "suporte@flytm.com.br",
        },
        to: {
          name: userFirstName,
          address: email,
        },
        subject: `Recuperação de conta - Fly TM`,
        html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 2rem auto; background-color: #161F30; color: #FFFFFF; padding: 1rem; border-radius: 0.5rem">
          <div style="width: 100%; height: 2rem; background-color: #9EF8EE"></div>
          <h1 style="font-size: 42px; color: #9EF8EE;">Olá, ${userFirstName}</h1>
          <p style="font-weight: 500; color: #FFFFFF;">
            Você solicitou uma recuperação de senha para sua conta na plataforma Fly TM,
            clique no link abaixo para continuar o processo.
          </p>
          <div style="width: 100%; background-color: #9EF8EE; display: flex; align-items: center; 
          justify-content: center; border-radius: 0.5rem">
            <a href="${apiBaseUrl}/users/recover-account/confirm-recovery-token?token_number=${tokenNumber}&id=${user.id}&email=${email}"
              style="text-decoration: none; color: #161F30; margin: 0.5rem 0; font-weight: bold;"
            >
              Criar nova senha
            </a>
          </div>
          <p style="font-size: 0.8rem; color: #FFFFFF;">
            Caso você não tenha solicitado uma troca de senha, por favor, ignore esse e-mail.
          </p>
          <div style="margin-top: 1rem; width: 100%; height: 2rem; background-color: #9EF8EE"></div>
        </div>`.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return { token: token.id };
    }
  );
}
