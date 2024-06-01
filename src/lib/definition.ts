export type User = {
  username: string;
  email: string;
};

export type Item = {
  name: string;
  description: string;
  starting_price: number;
  current_price: number | null;
  image_url: string | null;
  end_time: Date;
};
