import { Column, Entity , PrimaryGeneratedColumn} from "typeorm";

@Entity("pdfdoc")
export class Pdfdoc {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    nomfichier: string;

    @Column()
    contenutexteextrait: string;

    @Column()
    urlstockage: string;

}
