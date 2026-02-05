import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity({ name: "cal_meetings" })
export class CalMeeting {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  // ✅ ADD THIS
  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "date" })
  date: string;

  @Column({ type: "timestamptz" })
  start_time: Date;

  @Column({ type: "timestamptz" })
  end_time: Date;

  @Column({ default: "#3b82f6" })
  color: string;

  @Column({ default: "scheduled" })
  status: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
