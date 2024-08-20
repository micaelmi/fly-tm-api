import bcrypt from "bcrypt";
import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ClientError } from "../../errors/client-error";
import { prisma } from "../../lib/prisma";
import nodemailer from "nodemailer";
import { env } from "../../env";
import { getMailClient } from "../../lib/mail";

export async function registerUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users/register",
    {
      schema: {
        summary: "Create user",
        tags: ["users"],
        body: z.object({
          name: z.string().min(4),
          username: z.string().min(4),
          email: z.string().email(),
          password: z.string().min(8).max(32),
        }),
      },
    },
    async (request) => {
      const { name, username, email, password } = request.body;

      const existingUsername = await prisma.user.findFirst({
        select: { id: true },
        where: { username },
      });
      const existingEmail = await prisma.user.findFirst({
        select: { id: true },
        where: { email },
      });

      if (existingUsername) throw new ClientError("Username already in use");

      if (existingEmail) throw new ClientError("Email already in use");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
          user_type_id: 1,
        },
      });

      // send confirmation email
      const userFirstName = name.split(" ")[0];
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
        subject: `Bem-vindo(a) ao Fly TM!`,
        html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 2rem auto">
          <div style="width: 100%; height: 2rem; background-color: #3B82F6"></div>
          <h1 style="font-size: 42px; color: #3B82F6">Olá, ${userFirstName}</h1>
          <p style="font-weight: 500">
            Seja muito bem-vindo(a) ao fly TM, confirme seu e-mail clicando no botão abaixo para finalizar o cadastro
          </p>
          <div style="width: 100%; background-color: #3B82F6; display: flex; align-items: center; 
          justify-content: center; border-radius: 0.5rem">
            <a href="${apiBaseUrl}/users/register/confirm-email?user_id=${user.id}"
              style="text-decoration: none; color: #fff; margin: 0.5rem 0"
            >
              Confirmar
            </a>
          </div>
          <p style="font-size: 0.8rem">
            Caso você não tenha criado uma conta no Fly TM, por favor, ignore este e-mail.
          </p>
          <div style="margin-top: 1rem; width: 100%; height: 2rem; background-color: #3B82F6"></div>
      </div>`.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return { userId: user.id };
    }
  );
}
