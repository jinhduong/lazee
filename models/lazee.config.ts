export interface LazeeConfig {
    debounceTime?: number;
    onfocus?: (currentElem: Element) => void;
    outfocus?: (currentElem: Element) => void;
    /**
     * When user typing value into input
     */
    typing?: (value: any, event: KeyboardEvent) => void;
    /**
     * When user press enter
     */
    enter?: (value: any, event: KeyboardEvent) => void;
    /**
     * Give searchingValue then receive a result (maybe is promise) 
     */
    getData?: (searchingValue: any) => Promise<any[]> | any[];
    /**
     * Property that will display to autocomplete, default is string item
     * And display itself
     */
    displayProp?: string;
    /**
     * When user click into suggestion items
     */
    itemClick?: (item: any) => void;
    /**
     * Search method will be called after the lenght of world >= this value
     */
    wordLen?: number;
}