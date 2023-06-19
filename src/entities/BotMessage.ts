import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BotMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  messageKey: string;

  @Column()
  messageContent: string;
}
