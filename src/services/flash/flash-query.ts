export interface FlashQuery {
  start_date: string;
  end_date: string;
  country: string;
  state: string | null;
  city: string | null;
  utc_offset: string;
}

export const getQuery = ({
  start_date,
  end_date,
  state,
  city,
  utc_offset,
}: FlashQuery) => {
  const query = {
    start_date,
    end_date,
    country: "CO",
    utc_offset,
  } as FlashQuery;

  if (!!state) {
    query["state"] = state;
  }

  if (!!city) {
    query["city"] = city;
  }

  return query;
}
