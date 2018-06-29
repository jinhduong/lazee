export interface LazeeConfig {
    debounceTime?: number;
    onfocus?: (currentElem: Element) => void;
    outfocus?: (currentElem: Element) => void;
    typing?: (value: any, event: KeyboardEvent) => void;
    enter?: (value: any, event: KeyboardEvent) => void;
    getData?: (value: any) => Promise<any[]> | any[];
    displayProp?: string;
    itemClick?: (item: any) => void;
    wordLen?: number;
}