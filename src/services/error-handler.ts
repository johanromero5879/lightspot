import { AxiosError } from "axios"

export const getAxiosError = (error: any) => {
    if (!(error instanceof AxiosError)) return

    if (!error.response) throw Error(error.message)

    const {status, data} = error.response;

    if (!(data?.detail instanceof String)) return
    
    return {status, detail: data.detail}
}