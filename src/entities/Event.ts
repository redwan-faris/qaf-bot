import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Media } from "./Media";

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 ,type:"varchar"})
  address: string;

  @Column({ length: 255,type:"varchar" })
  reporter: string;
 
  @Column({length:1000,type:"varchar"})
  description:string;
  
  @OneToMany(() => Media, media => media.event)
  media: Media[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}