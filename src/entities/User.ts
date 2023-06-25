import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    Unique,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import * as bcrypt from "bcrypt";
  import { Exclude, Transform } from 'class-transformer';
import { Role } from './Role';
  
  @Entity('users') 
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 255 })
    username: string;
  
    @Column({ type: 'varchar', length: 255 })
    name: string;
  
    @Column({ type: 'varchar', length: 255 })
    @Exclude()
    password: string;
  
    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    @JoinColumn({ name: 'role_id' })
    @Transform(({ value }) => value.role_name)
    role: Role;
  
    @Column({ type: 'int' })
    @Exclude()
    role_id: number;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date; 


  
    hashPassword() {
      this.password = bcrypt.hashSync(this.password, 8);
    }
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      return bcrypt.compareSync(unencryptedPassword, this.password);
    }
  }