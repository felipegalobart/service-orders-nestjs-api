export interface IAddress {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
}

export interface IContact {
  name?: string;
  phone?: string;
  email?: string;
  sector?: string;
  isWhatsApp?: boolean;
  isDefault: boolean;
}

export interface IPerson {
  id: string;
  type?: 'customer' | 'supplier';
  name?: string;
  document?: string;
  corporateName?: string;
  tradeName?: string;
  stateRegistration?: string;
  municipalRegistration?: string;
  isExemptFromIE?: boolean;
  pessoaJuridica?: boolean;
  blacklist?: boolean;
  isActive?: boolean;
  deletedAt?: Date;
  notes?: string;
  addresses: IAddress[];
  contacts: IContact[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para dados de criação
export interface ICreatePerson {
  type?: 'customer' | 'supplier';
  name?: string;
  document?: string;
  corporateName?: string;
  tradeName?: string;
  stateRegistration?: string;
  municipalRegistration?: string;
  isExemptFromIE?: boolean;
  pessoaJuridica?: boolean;
  blacklist?: boolean;
  notes?: string;
  addresses?: IAddress[];
  contacts?: IContact[];
}

// Interface para dados de atualização
export interface IUpdatePerson {
  type?: 'customer' | 'supplier';
  name?: string;
  document?: string;
  corporateName?: string;
  tradeName?: string;
  stateRegistration?: string;
  municipalRegistration?: string;
  isExemptFromIE?: boolean;
  pessoaJuridica?: boolean;
  blacklist?: boolean;
  notes?: string;
  addresses?: IAddress[];
  contacts?: IContact[];
}
