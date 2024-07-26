import { ConsoleLogger } from '@nestjs/common';

export class MyLogger extends ConsoleLogger {
  log(message: any, stack?: string | '',){
 //   console.log("log-------->");
    super.log(message,  stack);
  }

  error(message: any, stack?: string | '', context?: string) {
 //   console.log("error-------->");
    super.error(message,  stack);
  }
}