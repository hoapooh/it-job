import { SetMetadata } from "@nestjs/common";

export const MESSAGE_RESPONSE = "message_response";
export const MessageResponse = (message: string) =>
  SetMetadata(MESSAGE_RESPONSE, message);
