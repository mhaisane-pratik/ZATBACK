import { Entity, PrimaryColumn, Column, UpdateDateColumn } from "typeorm";

@Entity("user_settings")
export class UserSettings {
  @PrimaryColumn("uuid")
  user_id: string;

  @Column({ type: "jsonb" })
  profile: any;

  @Column({ type: "jsonb" })
  notifications: any;

  @Column({ type: "jsonb" })
  video: any;

  @Column({ type: "jsonb" })
  meeting: any;

  @Column({ type: "jsonb" })
  appearance: any;

  @Column({ type: "jsonb" })
  security: any;

  @Column({ type: "jsonb" })
  shortcuts: any;

  @Column({ type: "jsonb" })
  integrations: any;

  @UpdateDateColumn()
  updated_at: Date;
}
