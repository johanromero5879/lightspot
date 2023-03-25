import moment from "moment";

import { BaseFlash } from "@/models/flash";
import { isFloat, isInt } from "@/utils/type-checker";

export const processFilePreview = async (file: File) => {
  let content = await file.text();
  content = content.trim();

  const lines = content.split("\n");
  const flashes = processLines(lines);

  return flashes;
};

const processLines = (lines: string[]): BaseFlash[] => {
  const flashes = [];

  for (let [index, line] of lines.entries()) {
    if (index === 9) break;

    const flash = processLine(line, index + 1);
    flashes.push(flash);
  }

  return flashes;
};

const processLine = (line: string, num: number): BaseFlash => {
  const [date, time, lat, lon, residual_fit_error, stations] = line.split(",");
  const row = [date, time, lat, lon, residual_fit_error, stations];

  if (row.some((column) => column === undefined))
    throw new Error("File format not valid");

  const datetime = `${date.trim()} ${time.trim()}`;
  const occurrence_date = moment.utc(datetime, "YYYY/MM/DD HH:mm:ss.SSSSSS", true);

  if (!occurrence_date.isValid())
    throw new Error(
      `occurrence_date is not valid in line ${num}: ${date} ${time}`
    );

  if (!isFloat(lat)) throw new Error(`lat is not valid in line ${num}: ${lat}`);

  if (!isFloat(lon)) throw new Error(`lon is not valid in line ${num}: ${lon}`);

  if (!isFloat(residual_fit_error))
    throw new Error(
      `residual_fit_error is not valid in line ${num}: ${residual_fit_error}`
    );
    
  if (!isInt(stations))
    throw new Error(`stations is not valid in line ${num}: ${stations}`);

  const flash = {
    occurrence_date: datetime,
    lat: parseFloat(lat),
    lon: parseFloat(lon),
    residual_fit_error: parseFloat(residual_fit_error),
    stations: parseInt(stations),
  };

  return flash;
};
