import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert,  VersionColumn } from "typeorm";
import { Password } from "../services/password";
import { AppDataSource } from "../data-source";
import { BadRequestError, EntityNotFoundError, NotFoundError } from "@krezona/common-library";

@Entity()
export class Otptable {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  username!: string;

  @Column('text', {
    nullable: true,
  })
  otpCode?: string;

  @Column({ type: 'timestamp' })
  dateCreated!: Date;

  @Column({ type: 'timestamp' })
  dateUpdated!: Date;

  @Column()
  version!: number;
}


