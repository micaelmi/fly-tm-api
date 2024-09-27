import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import cors from "@fastify/cors";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./env";
import { errorHandler } from "./error-handler";
import { registerUser } from "./routes/users/register";
import { login } from "./routes/users/login";
import { recoverAccount } from "./routes/users/recover-account";
import { confirmEmail } from "./routes/users/confirm-email";
import { confirmRecoveryToken } from "./routes/users/confirm-recovery-token";
import { changePassword } from "./routes/users/change-password";
import { listAllUsers } from "./routes/users/list";
import { verifyToken } from "./middlewares/verify-token";
import { createEvent } from "./routes/events/create";
import { listEvents } from "./routes/events/list";
import { deleteEvent } from "./routes/events/delete";
import { updateEvent } from "./routes/events/update";
import { getEventById } from "./routes/events/get-by-id";
import { getEventsByOwner } from "./routes/events/get-by-owner";
import { createClub } from "./routes/clubs/create";
import { listClubs } from "./routes/clubs/list";
import { deleteClub } from "./routes/clubs/delete";
import { updateClub } from "./routes/clubs/update";
import { getClubById } from "./routes/clubs/get-by-id";
import { getClubsByOwner } from "./routes/clubs/get-by-owner";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Fly TM API",
      description: "API para o app de tênis de mesa Fly TM",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

// user authentication routes
app.register(registerUser);
app.register(confirmEmail);
app.register(login);
app.register(recoverAccount);
app.register(confirmRecoveryToken);
app.register(changePassword);

// event routes
app.register(createEvent);
app.register(listEvents);
app.register(deleteEvent);
app.register(updateEvent);
app.register(getEventById);
app.register(getEventsByOwner);

// club routes
app.register(createClub);
app.register(listClubs);
app.register(deleteClub);
app.register(updateClub);
app.register(getClubById);
app.register(getClubsByOwner);

app.register(async (app) => {
  app.addHook("preHandler", verifyToken);
  // user authenticated routes
  app.register(listAllUsers);
});

app.listen({ port: env.PORT }).then(() => {
  console.log("Server flying! 🚀");
});
