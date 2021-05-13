import { pool } from './conn';

export type User = {
  id: number;
  email: string;
  username: string;
  createdAt: Date;
}

type UserTable = {
  id: string;
  email: string;
  username: string;
  created_at: Date;
}

const mapUserTableToUser = ({ id, email, username, created_at }: UserTable): User => ({
  id: parseInt(id, 10),
  email,
  username,
  createdAt: created_at
});

export const getUsers = async (): Promise<User[]> => {
  const result = await pool.query<UserTable>(`
    SELECT * FROM users
  `)
  return result.rows.map(mapUserTableToUser);
}
