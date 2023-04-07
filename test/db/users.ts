import { pool } from './conn';

export type User = {
  id: number;
  email: string;
  username: string;
  createdAt: Date;
  messages: Message[];
};

type Message = {
  message: string;
  createdAt: Date;
};

type UserTable = {
  id: string;
  email: string;
  username: string;
  created_at: Date;
};

type MessageTable = {
  id: string;
  user_id: string;
  message: string;
  created_at: Date;
};

const mapMessageTableToMessage = ({
  message,
  created_at,
}: MessageTable): Message => ({
  message,
  createdAt: created_at,
});

const mapUserTableToUser = async ({
  id,
  email,
  username,
  created_at,
}: UserTable): Promise<User> => ({
  id: parseInt(id, 10),
  email,
  username,
  createdAt: created_at,
  messages: await getUserMessages(id),
});

export const getUsers = async (): Promise<User[]> => {
  const result = await pool.query<UserTable>(`
    SELECT * FROM users ORDER BY id
  `);
  return Promise.all([...result.rows.map(mapUserTableToUser)]);
};

const getUserMessages = async (id: string): Promise<Message[]> => {
  const result = await pool.query<MessageTable>(
    `
    SELECT * FROM user_messages
    WHERE user_id = $1
  `,
    [id]
  );
  return result.rows.map(mapMessageTableToMessage);
};
