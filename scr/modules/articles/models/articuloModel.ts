import { db } from "../../../config/db";

const API_URL = "https://api.npoint.io/4bcd8e73c1067cb36360";

const getArticulosFromDB = async (): Promise<any[]> => {
  const [rows]: any = await db.query(`
    SELECT 
      articulo,
      precio,
      descuento,
      urlimagen,
      valoracion,
      descripcion,
      calificaciones
    FROM articulos
  `);
  return rows;
};

const saveArticulosToDB = async (articulos: any[]) => {
  for (const art of articulos) {
    await db.query(
      `INSERT INTO articulos 
  (articulo, precio, descuento, urlimagen, valoracion, descripcion, calificaciones)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE 
    precio = VALUES(precio),
    descuento = VALUES(descuento),
    urlimagen = VALUES(urlimagen),
    valoracion = VALUES(valoracion),
    descripcion = VALUES(descripcion),
    calificaciones = VALUES(calificaciones)`,
      [
        art.articulo,
        Number(art.precio),
        Number(art.descuento),
        art.urlimagen,
        Number(art.valoracion),
        art.descripcion,
        Number(art.calificaciones),
      ],
    );
  }
};

const fetchArticulosFromAPI = async (): Promise<any[]> => {
  const response = await fetch(API_URL);
  const json = await response.json();
  return json.articulos || [];
};

export const getAllArticulos = async (): Promise<any[]> => {
  const articulosDB = await getArticulosFromDB();

  if (articulosDB.length > 0) {
    return articulosDB;
  }

  const articulosAPI = await fetchArticulosFromAPI();

  await saveArticulosToDB(articulosAPI);

  return articulosAPI;
};

export const getArticulosConDescuento = async (): Promise<any[]> => {
  const [rows]: any = await db.query(
    "SELECT * FROM articulos WHERE descuento > 0",
  );
  return rows;
};

export const syncArticulos = async (): Promise<void> => {
  const articulosAPI = await fetchArticulosFromAPI();
  await saveArticulosToDB(articulosAPI);
};
