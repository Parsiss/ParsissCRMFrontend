export interface ComboOption<T> {
    Value: T;
    Text: string;
    Selected: boolean;
}

export interface ComboOptions<T> {
    [key: string]: ComboOption<T>[]
}


export interface ActiveFilters {
    [key: string]: any[];
}

