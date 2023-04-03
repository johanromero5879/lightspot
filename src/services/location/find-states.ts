import axios from "axios";
import { AxiosError } from "axios";

const instance = axios.create({ baseURL: "/" });
export const findStates = async () => {
  try {
    const { data } = await instance.get("json/states.json");
    // const states = data.map((state:any)=> state.state)
    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const { detail } = err.response?.data;
      throw new Error(detail);
    }

    throw new Error("Failed to consult with file");
  }
};
