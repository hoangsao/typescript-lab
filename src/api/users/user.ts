export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  address: string | undefined;
  city: string | undefined;
  state: string | undefined;
  stateCode: string | undefined;
  postalCode: string | undefined;
  coordinates: Coordinates | undefined;
  country: string | undefined;
}

export interface Hair {
  color: string | undefined;
  type: string | undefined;
}

export interface Bank {
  cardExpire: string | undefined;
  cardNumber: string | undefined;
  cardType: string | undefined;
  currency: string | undefined;
  iban: string | undefined;
}

export interface Company {
  department: string | undefined;
  name: string | undefined;
  title: string | undefined;
  address: Address | undefined;
}

export interface Crypto {
  coin: string | undefined;
  wallet: string | undefined;
  network: string | undefined;
}

export class User {
  id: number | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  maidenName: string | undefined;
  age: number | undefined;
  gender: string | undefined;
  email: string | undefined;
  phone: string | undefined;
  username: string | undefined;
  password: string | undefined;
  birthDate: string | undefined;
  image: string | undefined;
  bloodGroup: string | undefined;
  height: number | undefined;
  weight: number | undefined;
  eyeColor: string | undefined;
  hair: Hair | undefined;
  ip: string | undefined;
  address: Address | undefined;
  macAddress: string | undefined;
  university: string | undefined;
  bank: Bank | undefined;
  company: Company | undefined;
  ein: string | undefined;
  ssn: string | undefined;
  userAgent: string | undefined;
  crypto: Crypto | undefined;
  role: string | undefined;

  constructor (initializer: Partial<User> = {}) {
    Object.assign(this, initializer)
  }
}