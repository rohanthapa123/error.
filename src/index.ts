//load all the environments here
import { config } from "dotenv";

const envFile =
  process.env.NODE_ENV === "test"
    ? ".env.test"
    : process.env.NODE_ENV === "development"
    ? ".env.dev"
    : ".env";
console.log(envFile);
config({ path: envFile });

import { AppDataSource } from "./data-source";
import { app, server } from "./app";
import { DatabaseConnectionError } from "@krezona/common-library";
import { logger } from "@krezona/common-library";

AppDataSource.initialize()
  .then(async () => {
    server.listen(3010, () => {
      logger.info("Listening at port number 3010");
    });
  })
  .catch((error) => {
    logger.error("Database connection error", error);
    throw new DatabaseConnectionError();
  });
