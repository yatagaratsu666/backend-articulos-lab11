import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {findUserByEmail, findUserById, registerUser } from '../models/UserModel';
import { AuthRequest } from '../../../middleware/AuthMiddleware';
import { generateAccessToken, generateRefreshToken } from '../../../utils/jwt';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  const { email, contrasena } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(contrasena, user.contrasena);

    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const accessToken = generateAccessToken(user);

    return res.json({
      message: 'Login exitoso',
      accessToken
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error interno' });
  }
};

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { nombre_usuario, email, contrasena } = req.body;

    if (!nombre_usuario || !email || !contrasena) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    const result = await registerUser(req.body);

    return res.json({
      message: 'Usuario registrado correctamente',
      result
    });

  } catch (error: any) {

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        message: 'El email ya está registrado'
      });
    }

    return res.status(500).json({
      message: 'Error al registrar usuario'
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    return res.json({
      nombre_usuario: user.nombre_usuario,
      email: user.email
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error interno'
    });
  }
};


export const enableBiometric = async (req: Request, res: Response) => {
  const { email, contrasena } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(contrasena, user.contrasena);

    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const refreshToken = generateRefreshToken(user);

    return res.json({
      message: 'Biometría habilitada',
      refreshToken
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error interno' });
  }
};


export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token requerido' });
  }

  try {
    const decoded: any = jwt.verify(
      refreshToken,
      process.env['JWT_REFRESH_SECRET'] as string
    );

    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const newAccessToken = generateAccessToken(user);

    return res.json({
      accessToken: newAccessToken
    });

  } catch (error) {
    return res.status(401).json({ message: 'Refresh token inválido' });
  }
};
