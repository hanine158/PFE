import { AnalyseRe } from "src/analyse-res/entities/analyse-re.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("schema")
export class Schema {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    titre:string;

    @Column()
    contenu:string;

    @Column()
    imageUrl:string;

    @ManyToMany(() => AnalyseRe, (analyse) => analyse.schema, {
  cascade: false,
})
@JoinTable({
  name: 'analyse_schema', 
  joinColumn: {
    name: 'schema_id',
    referencedColumnName: 'id',
  },
  inverseJoinColumn: {
    name: 'analyseRe_id',
    referencedColumnName: 'id',
  },
})
analyseRe: AnalyseRe[];





}
