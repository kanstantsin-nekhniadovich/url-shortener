import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { InjectDb } from '../../db/db.provider';
import { userTable } from '../../db/schema';
import type { DB } from '../../db/client';
import { CreateUser, User } from 'src/types/user.types';

@Injectable()
export class UserRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async createUser({ name, email }: CreateUser): Promise<User> {
    const [user] = await this.db
      .insert(userTable)
      .values({ name, email })
      .returning();

    return user;
  }

  async find(id: string) {
    const [user] = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id));

    if (!user) {
      return null;
    }

    return user;
  }

  async findAll() {
    return this.db.select().from(userTable);
  }
}
