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
import { registerUser } from "./routes/user/register";
import { login } from "./routes/user/login";
import { recoverAccount } from "./routes/user/recover-account";

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

app.register(registerUser);
app.register(login);
app.register(recoverAccount);

app.listen({ port: env.PORT }).then(() => {
  console.log("Server flying! 🚀");
});
