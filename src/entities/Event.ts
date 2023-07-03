import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Media } from "./Media";
import { TypeEnum } from "../enums/TypeEnum";
import { Member } from './Member';
import { Transform } from "class-transformer";

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 ,type:"varchar"})
  address: string;

  @Column({ type: 'enum', enum: TypeEnum})
  type: TypeEnum;

 
  @Column({length:1000,type:"varchar"})
  description:string;
  
  @OneToMany(() => Media, media => media.event,{eager:true})
  media: Media[];

  @ManyToOne(() => Member, (member) => member.events)
  @Transform(({ value }) => value.role_name)
  member: Member;

  @Column({type:'bigint',name:'member_id'})
  mebmerId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}