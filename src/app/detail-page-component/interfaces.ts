export interface option {
    value: string;
    text: string;
    selected: string;
}
  
export interface optionGroup {
    name: string;
    values: option[];
}
