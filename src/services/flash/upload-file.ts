import { AxiosError } from "axios";
import axios from "@/plugins/axios";

export const uploadFile = async (file: File) => {
  const form = new FormData();
  form.append("file", file);

  try {
    const { data } = await axios.post("/flashes/upload", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });

    return data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      const { detail } = err.response?.data;
      throw new Error(detail);
    }

    throw new Error("Failed to upload file");
  }
};
