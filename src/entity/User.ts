import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    email!: string;

    @Column('bigint',{ nullable: true})
    phoneNumber!: number;

    @Column({ nullable: true  })
    addressOne?: string;

    @Column({ nullable: true  })
    addressTwo?: string;

    @Column({ default: false })
    isActive!: boolean ;

    @Column({ default: false })
    isStaff!: boolean;

    @Column({ default: false })
    isAdmin!: boolean;

    @Column({ type: 'uuid', nullable: true })
    permissionGroup?: string;

    @Column({ default: false })
    verifiedPhone: boolean = false;

    @Column({ default: false })
    verifiedEmail: boolean = false;

    @Column({ nullable: true})
    facebookId!: string;

    @Column({ nullable: true})
    googleId!: string;

    @Column({ nullable: true })
    userImage!: string;

    @Column({ default:true })
    hasAcces!: boolean;

    
    @Column({ type: 'timestamp' })
    dateCreated!: Date;

    @Column({ type: 'timestamp' })
    dateUpdated!: Date;

    @Column()!
    version!: number;

    
}
