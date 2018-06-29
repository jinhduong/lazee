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
     * Give value and item, then receive a result (maybe is promise) 
     */
    getData?: (value: any) => Promise<any[]> | any[];
    /**
     * Property that will display to autocomplete, default is string item
     * And display itself
     */
    displayProp?: string;
    /**
     * When user click to any suggestion items
     */
    itemClick?: (item: any) => void;
    /**
     * Will call search method when lenght of world >= this value
     */
    wordLen?: number;
}