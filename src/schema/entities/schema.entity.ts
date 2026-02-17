import { AnalyseRe } from "src/analyse-res/entities/analyse-re.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("schema")
export class Schema {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column()
  contenu: string;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => AnalyseRe, (analyse) => analyse.schemas, {
    onDelete: "CASCADE",
  })
  analyseRe: AnalyseRe;
}
