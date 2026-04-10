import { AnalyseRe } from "../../analyse-res/entities/analyse-re.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("schema")
export class Schema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titre!: string;

  @Column({ type: "text" })
  contenu!: string;

  @Column({ type: "text", nullable: true }) // 🔥 التصحيح هنا
  imageUrl!: string | null;

  @ManyToOne(() => AnalyseRe, (analyse) => analyse.schemas, {
    onDelete: "CASCADE",
  })
  analyseRe!: AnalyseRe;
}