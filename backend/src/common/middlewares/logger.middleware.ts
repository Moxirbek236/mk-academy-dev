import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url, headers } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length') || 0;
      const duration = Date.now() - startTime;
      
      this.logger.log(
        `[${method}] ${url} - ${statusCode} - ${contentLength}b - ${duration}ms - ${ip} - ${userAgent}`
      );
      
      // Strict tracking logic for security could be expanded here.
    });

    next();
  }
}
