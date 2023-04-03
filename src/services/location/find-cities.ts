import axios from "axios";
import { AxiosError } from "axios";

const instance = axios.create({ baseURL: "/" });
export const findCities = async (state: string) => {
  try {
    const { data } = await instance.get("json/cities.json");
    const cities = data.filter((city: any) => city.state == state);
    return cities;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const { detail } = err.response?.data;
      throw new Error(detail);
    }

    throw new Error("Failed to consult with file");
  }
};
