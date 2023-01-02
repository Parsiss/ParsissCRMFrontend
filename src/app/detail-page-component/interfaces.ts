export interface option {
    value: number;
    text: string;
    selected: string;
}
  
export interface optionGroup {
    name: string;
    values: option[];
}
