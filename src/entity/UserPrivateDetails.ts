import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, VersionColumn} from 'typeorm';

@Entity('edtraaUsersPrivateDetails')
export class UserDetails{

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid'})
  staffProfile?: string;

  
  @Column({ type: 'timestamp' })
  dateCreated!: Date;

  @Column({ type: 'timestamp' })
  dateUpdated!: Date;

  
  @Column()!
  version!: number;
}