import "reflect-metadata";
import { DataSource } from "typeorm";
import { Company } from "../modules/company/company.entity";
import { User } from "../modules/users/user.entity";
import { UserSettings } from "../modules/settings/settings.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [Company, User, UserSettings],
  synchronize: false,
  logging: false,
});
