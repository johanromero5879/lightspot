import { AxiosError } from "axios";
import apiClient from "@/plugins/api-client";

interface Query { 
  start_date:string
  end_date:string
  country:string
  state:string
  city:string
}

export const findFlashes = async ({start_date,end_date,state,city}:Query) => {
  try {
    const { data } = await apiClient.get("/flashes",{
        params:{
            start_date,
            end_date,
            country:"CO",
            state,
            city
        }
    })
    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const { detail } = err.response?.data;
      throw new Error(detail);
    }

    throw new Error("Not Found");
  }
};
