import { Injectable } from "@nestjs/common";
import * as argon2 from 'argon2';
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class SecurityService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }

  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }




}


