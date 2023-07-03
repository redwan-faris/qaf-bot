import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Media } from "./Media";
import { TypeEnum } from "../enums/TypeEnum";

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 ,type:"varchar"})
  address: string;

  @Column({ type: 'enum', enum: TypeEnum})
  type: TypeEnum;

  @Column({ nullable:true, length: 255,type:"varchar" })
  reporter: string;
 
  @Column({length:1000,type:"varchar"})
  description:string;
  
  @OneToMany(() => Media, media => media.event,{eager:true})
  media: Media[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}