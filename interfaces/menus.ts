export interface IMenu {
  _id: string;
  item: Food[];
  restaurant: string;
}

export interface Food {
  name: string;
  price: string;
  description: string;
  archive: boolean;
  available: boolean;
}
