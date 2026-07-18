export type Cloth = {
  id: number;
  name: string;
  category: string | null;
  festival: string | null;
  description: string | null;
  size: string | null;
  price: number;
  security_deposit: number;
  image_url: string | null;
  active: boolean;
  created_at: string;
};

export type Booking = {
  id: number;
  cloth_id: number;
  customer_name: string;
  phone: string;
  email: string;
  booking_from: string;
  booking_to: string;
  status: string;
  remarks: string | null;
  created_at: string;
  clothes?: Pick<Cloth, "id" | "name" | "category" | "festival"> | null;
};

export type BookingFormData = {
  clothId: number;
  customerName: string;
  phone: string;
  email: string;
  bookingFrom: string;
  bookingTo: string;
  remarks?: string;
};
