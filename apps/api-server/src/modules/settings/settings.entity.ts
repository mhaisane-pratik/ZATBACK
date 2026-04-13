import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("user_settings")
export class UserSettings {
  @PrimaryColumn("uuid")
  user_id!: string;

  @Column({ type: "jsonb", nullable: true })
  settings!: any;

  @Column({ nullable: true })
  avatar!: string | null;

  @Column({ name: "password_hash", type: "text", nullable: true })
  password_hash!: string | null;
}
