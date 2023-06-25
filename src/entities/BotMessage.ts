import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bot_messages')
export class BotMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  messageKey: string;

  @Column()
  messageContent: string;
}
