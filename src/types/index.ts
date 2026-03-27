export type Dog = {
  id: string;
  name: string;
  breed: string;
  birthdate: string;
  gender: 'male' | 'female' | 'unknown';
  color: string;
  photo: string | null;
  species: 'dog';
};

export type Category = 'honjitsu' | 'gohan' | 'taicho';
export type MealTime = 'asa' | 'hiru' | 'yoru' | 'oyatsu';

export type Log = {
  id: string;
  dogId: string;
  date: string;
  category: Category;
  app: number | null;
  sto: number | null;
  vit: number | null;
  mealTime: MealTime | null;
  note: string;
  vet: string | null;
  img: string | null;
};

export type Settings = {
  theme: 'dark' | 'light';
};

export type Tab = 'yousu' | 'kiroku' | 'omoide' | 'settei';
