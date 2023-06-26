import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import express from "express";
import { BotMessage } from "../../entities/BotMessage";
import { BotMessageDto } from "../../types/bot-message.type";
import { BotMessageService } from "./bot-message.service";

const botMessagesService = new BotMessageService();
// TODO make helper to handle response
export class BotMessageController {

  async getBotMessages(req: express.Request, res: express.Response) {
    try {
      const botMessages: BotMessage[] = await botMessagesService.getAllBotMessages();
      res.json({
        success: true,
        status: 200,
        data: botMessages,
      });
    } catch (error) {

      res.status(500).json({
        errMessage: "Internal Server Error",
      });
    }
  }

  async getEventById(req: express.Request, res: express.Response) {
    try {
      const botMessagesId: number = +req.params.id;
      const botMessages: BotMessage = await botMessagesService.getBotMessageById(botMessagesId);
      res.status(200).json({
        success: true,
        status: 200,
        data: botMessages,
      });
    } catch (error: any) {
      res.status(400).json({
        status: 400,
        error: error.message,
        success: false
      });
    }
  }

  async createBotMessage(req: express.Request, res: express.Response) {
    const dto: BotMessageDto = plainToInstance(BotMessageDto, req.body);
    const errors: ValidationError[] = await validate(dto);


    if (errors.length > 0) {
      const validationErrors: any[] = [];
      errors.forEach((error: ValidationError) => {
        const constraints = error.constraints as { [type: string]: string };
        if (constraints) {
          Object.keys(constraints).forEach((type: string) => {
            validationErrors.push({ [error.property]: constraints[type] });
          });
        }
      });

      return res.status(400).json({ status: 400, success: false, errors: validationErrors });
    }

    const message: BotMessage = await botMessagesService.addBotMessages(dto);
    res.status(201).json({
      success: true,
      status: 201,
      data: message,
    });
  }


  async updateBotMessage(req: express.Request, res: express.Response) {
    const dto: BotMessageDto = plainToInstance(BotMessageDto, req.body);
    const errors: ValidationError[] = await validate(dto);

    // TODO make helper to handle the validation
    if (errors.length > 0) {
      const validationErrors: any[] = [];
      errors.forEach((error: ValidationError) => {
        const constraints = error.constraints as { [type: string]: string };
        if (constraints) {
          Object.keys(constraints).forEach((type: string) => {
            validationErrors.push({ [error.property]: constraints[type] });
          });
        }
      });

      return res.status(400).json({ status: 400, success: false, errors: validationErrors });
    }
    const botMessagesId: number = +req.params.id;
    try {
      const message: BotMessage = await botMessagesService.updateBotMessages(dto, botMessagesId);
      res.status(200).json({
        success: true,
        status: 200,
        data: message,
      });
    } catch (error: any) {
      res.status(404).json({
        status: 404,
        error: error.message,
        success: false
      });
    }
  }

  async deleteBotMessage(req: express.Request, res: express.Response) {
    try {
      const botMessagesId: number = +req.params.id;
      await botMessagesService.deleteBotMessage(botMessagesId);
      res.status(200).json();
    } catch (error:any) {
      res.status(404).json({
        status: 404,
        error: error.message,
        success: false
      });
    }
  }
}
