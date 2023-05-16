import apiClient from "@/plugins/api-client";

import { getAxiosError } from "@/services/error-handler"

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
  } catch (error: any) {
    error = getAxiosError(error)

    if (!error) throw new Error("Error al subir o procesar el archivo");
    const {status, detail} = error
    
    if (detail) throw new Error(detail);
  }
};
