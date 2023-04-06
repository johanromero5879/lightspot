export interface FlashQuery {
  start_date: string;
  end_date: string;
  country: string;
  state: string | null;
  city: string | null;
  utc_offset: string;
}
