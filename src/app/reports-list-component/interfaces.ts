
export interface filterOption {
    value: string;
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


