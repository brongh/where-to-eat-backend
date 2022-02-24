export interface IOperatingHours {
  _id: string;
  monday: HoursInADay[];
  tuesday: HoursInADay[];
  wednesday: HoursInADay[];
  thursday: HoursInADay[];
  friday: HoursInADay[];
  saturday: HoursInADay[];
  sunday: HoursInADay[];
  holidays: HoursInAHoliday[];
  restaurant: string;
}

export interface HoursInADay {
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
}

export interface HoursInAHoliday extends HoursInADay {
  date: string;
}
