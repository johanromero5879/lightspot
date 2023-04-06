import moment from "moment";

import { BaseFlash } from "@/models/flash";
import { isFloat, isInt } from "@/utils/type-checker";

export const processFilePreview = async (file: File) => {
  let content = await file.text();
  content = content.trim();

  const lines = content.split("\n");
  const flashes = processLines(lines);

  return [flashes, lines.length];
};

const processLines = (lines: string[]): BaseFlash[] => {
  const flashes = [];

  for (let [index, line] of lines.entries()) {
    if (index === 10) break;

    const flash = processLine(line, index + 1);
    flashes.push(flash);
  }

  return flashes;
};

const processLine = (line: string, num: number): BaseFlash => {
  const [date, time, lat, lon, residual_fit_error, stations] = line.split(",");
  const row = [date, time, lat, lon, residual_fit_error, stations];

  if (row.some((column) => column === undefined))
    throw new Error("Formato de archivo no válido");

  const datetime = `${date.trim()} ${time.trim()}`;
  const occurrence_date = moment.utc(datetime, "YYYY/MM/DD HH:mm:ss.SSSSSS", true);

  if (!occurrence_date.isValid())
    throw new Error(
      `La fecha de ocurrencia no es válida en la línea ${num}`
    );

  if (!isFloat(lat)) throw new Error(`La latitud no es válida en la línea ${num}`);

  if (!isFloat(lon)) throw new Error(`La longitud no es válida en la línea ${num}`);

  if (!isFloat(residual_fit_error) && !isInt(residual_fit_error))
    throw new Error(
      `El error de ajuste residual no es válida en la línea ${num}`
    );
    
  if (!isInt(stations))
    throw new Error(`El número de estaciones no es válido en la línea ${num}`);

  const flash = {
    occurrence_date: datetime,
    lat: parseFloat(lat),
    lon: parseFloat(lon),
    residual_fit_error: parseFloat(residual_fit_error),
    stations: parseInt(stations),
  };

  return flash;
};
