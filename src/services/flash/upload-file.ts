import { AxiosError } from "axios";
import apiClient from "@/plugins/api-client";

export const uploadFile = async (file: File) => {
  const form = new FormData();
  form.append("file", file);

  try {
    const { data } = await apiClient.post("/flashes/upload", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });

    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const data = err.response?.data;
      if(data?.detail) throw new Error(data.detail)
    }

    throw new Error("Error al subir el archivo");
  }
};
