export interface Budget {
  id?: number;
  categoryId?: number; // Lo usamos para enviar (POST)
  category?: {         // Lo usamos para recibir (GET)
    id: number;
    name: string;
    type: string;
  };
  amountLimit: number;
  month: number;
  year: number;
}
