export interface IRestaurants {
  _id?: string;
  name: string;
  contactNumber: string;
  address: addressDetails;
  operatingHours?: string;
  ratingRecord?: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface addressDetails {
  street: string;
  postalCode: string;
  building?: string;
  block?: string;
  unit?: string;
  longitude: number;
  latitude: number;
}
