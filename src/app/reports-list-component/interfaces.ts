
export interface filterOption {
    value: number;
    text: string;
    selected: string;
}
  
export interface filterGroup {
    name: string;
    values: filterOption[];
}
  
export interface KeyListOfValues <T> {
    [key: string]: T[];
}

export interface KeyOfValues <T> {
    [key: string]: T;
}

export interface AutolFillOptions {
    [key: string]: [string, number][];
}


