import { Request, Response } from 'express';
import {
  getAllArticulos,
  getArticulosConDescuento,
  syncArticulos
} from '../models/articuloModel';

export const obtenerArticulos = async (_req: Request, res: Response) => {
  try {
    const articulos = await getAllArticulos();
    res.json(articulos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener artículos' });
  }
};

export const obtenerArticulosConDescuento = async (_req: Request, res: Response) => {
  try {
    const articulos = await getArticulosConDescuento();
    res.json(articulos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener artículos con descuento' });
  }
};

export const sincronizarArticulos = async (_req: Request, res: Response) => {
  try {
    await syncArticulos();
    res.json({ message: "Sincronización exitosa" });
  } catch (error) {
    res.status(500).json({ message: 'Error al sincronizar' });
  }
};