export type Prettify<T> = {
    [K in keyof T]: T[K];
  };
  
  export type Optional<T, K extends keyof T> = Prettify<
    Omit<T, K> & Partial<Pick<T, K>>
  >;
  
  export type Mandatory<T, K extends keyof T> = Prettify<
    Pick<T, K> & Partial<Omit<T, K>>
  >;