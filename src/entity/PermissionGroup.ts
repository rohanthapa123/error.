import {  AfterInsert, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PermissionEventPublisher, PermissionEvent } from "../kafka/publisher";

interface Permission {
  id: string;
  permission: string;
  // Add other permission fields as needed
}


@Entity("permissionGroup")
export class PermissionGroup {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  profileName!: string;

  @Column("jsonb")
  permissions!: Permission[];

  
  @Column({ type: 'timestamp' })
  dateCreated!: Date;

  @Column({ type: 'timestamp' })
  dateUpdated!: Date;

  
  @Column()
  version!: number;

}
