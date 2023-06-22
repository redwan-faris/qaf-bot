import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bot-messages')
export class BotMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  messageKey: string;

  @Column()
  messageContent: string;
}
