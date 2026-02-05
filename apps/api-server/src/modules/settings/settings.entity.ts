import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("user_settings")
export class UserSettings {
  @PrimaryColumn("uuid")
  user_id!: string;

  // PROFILE
  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true, unique: true })
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  address!: string;

  @Column({ nullable: true })
  avatar!: string;

  // AUTH
  @Column({ nullable: true })
  password_hash!: string;

  // SETTINGS JSON
  @Column({ type: "jsonb" })
  settings!: any;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
