import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chat')
export class Chat {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({type: "uuid"})
    firstUser!: string;

    @Column({type: "uuid"})
    secondUser!: string;
    
    @Column({ type: 'timestamp' })
    dateCreated!: Date;

    @Column({ type: 'timestamp' })
    dateUpdated!: Date;

    @Column()!
    version!: number;

    @BeforeInsert()
    async beforeInsert() {
        this.dateCreated = new Date();
        this.dateUpdated = new Date();
    }
    
}
