import axios from "axios";

import { getAxiosError } from "@/services/error-handler"

const instance = axios.create({ baseURL: "/" });

export const findStates = async () => {
  try {
    const { data } = await instance.get("json/states.json");

    return data;
  } catch (error: any) {
    error = getAxiosError(error)

    if (!error) throw new Error("Error al consultar los departamentos");
    const {status, detail} = error
    
    if (detail) throw new Error(detail);
  }
};
