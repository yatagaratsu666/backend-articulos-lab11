import { db } from "../../../config/db";
import { User } from "../../../types/UserInterface";
import bcrypt from 'bcrypt';

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows]: any = await db.query(
    'SELECT * FROM usuario WHERE email = ?',
    [email]
  );

  return rows[0] || null;
};

export const registerUser = async (user: any) => {
  const hashedPassword = await bcrypt.hash(user.contrasena, 10);

  const [result] = await db.query(
    `INSERT INTO usuario 
    (nombre_usuario, email, contrasena, foto_perfil) 
    VALUES (?, ?, ?, ?)`,
    [
      user.nombre_usuario,
      user.email,
      hashedPassword,
      user.foto_perfil || null,
    ]
  );

  return result;
};

export const findUserById = async (id: number): Promise<User | null> => {
  const [rows]: any = await db.query(
    'SELECT * FROM usuario WHERE id_usuario = ?',
    [id]
  );

  return rows[0] || null;
};