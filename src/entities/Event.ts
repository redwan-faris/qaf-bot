import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { City } from "./City";
import { Media } from "./Media";

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 255 })
  reporter: string;

  @Column({ name: 'city_id' })
  cityId: number;

  @ManyToOne(() => City, city => city.events)
  city: City;

  @OneToMany(() => Media, media => media.event)
  media: Media[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}