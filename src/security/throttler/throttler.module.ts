import { Module } from '@nestjs/common';
import { ThrottlerModule as Throttler } from '@nestjs/throttler';

// NOTE: Configure it instead of using nginx if you want more flexibility or other solutions.
// Rate limiting module to prevent abuse of the API.
@Module({
  imports: [
    Throttler.forRoot([
      {
        ttl: 60000,
        limit: 10
      }
    ])
  ]
})
export class ThrollerModule {}
