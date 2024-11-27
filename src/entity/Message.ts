import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum MessageStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    SEEN = "seen",
}
export enum MessageType {
    IMAGE = "image",
    VIDEO = "video",
    DOCUMENT = "document",
    TEXT = "text",
}

@Entity('message')
export class Message {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({type: "uuid"})
    chatId!: string;
    
    @Column({type: "uuid"})
    sender!: string;

    @Column()
    text!: string;

    @Column({type: "enum", enum: MessageStatus})
    status!: MessageStatus;

    @Column({type: "enum", enum: MessageType})
    type!: MessageType;
    
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
