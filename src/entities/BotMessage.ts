import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bot_messages')
export class BotMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:"sequence",default:1})
  sequence:number;

  @Column({name:'message_key'})
  messageKey: string;

  @Column({name:'message_content',length:500})
  messageContent: string;
}
