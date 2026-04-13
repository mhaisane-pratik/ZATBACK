import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Company } from "../company/company.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "company_id", type: "uuid", nullable: true })
  companyId: string | null;

  @ManyToOne(() => Company, (company) => company.users, { nullable: true })
  @JoinColumn({ name: "company_id" })
  company?: Company | null;

  @Column({ nullable: true })
  username: string | null;

  @Column({ nullable: true })
  email: string | null;

  @Column({ name: "password_hash", type: "text", nullable: true, select: false })
  passwordHash: string | null;
}
