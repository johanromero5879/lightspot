import axios from "axios";

import { getAxiosError } from "@/services/error-handler"

const instance = axios.create({ baseURL: "/" });

export const findCities = async (state: string) => {
  try {
    const { data } = await instance.get("json/cities.json");
    const cities = data.filter((city: any) => city.state == state);
    return cities;
  } catch (error: any) {
    error = getAxiosError(error)

    if (!error) throw new Error("Error al consultar las ciudades");
    const {status, detail} = error
    
    if (detail) throw new Error(detail);
  }
};
