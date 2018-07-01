# lazee
💨 The simple, lightweight, Google search like and pure javascript auto-complete.

- Only `3kb` script, `1kb` css
- Easy to implement and modify
- Google like desgin

[![Build Status](https://travis-ci.org/jinhduong/lazee.svg?branch=master)](https://travis-ci.org/jinhduong/lazee)

![lazee](https://i.imgur.com/ECyhlpu.gif)

Download lastest build at `dist` folder.

## Usage
```html
<html>
<link rel="stylesheet" href="./src/lazee.css">
<body>
    <div id="autocomplete"></div>
</body>
</html>
<script src="./src/lazee.js"></script>
<script>
    var $autoComplete = new Lazee('#autocomplete', {
        debounceTime: 200,
        getData: function (searchingValue) {
            return fetch('https://jsonplaceholder.typicode.com/users')
                .then(data => data.json())
                .then(data => {
                    return data.filter(x => x.name.includes(searchingValue));
                });
        },
        displayProp: 'name'
    });
</script>
```

## Configs
All of config types in `models/*` folder.
### LazeeConfig
```ts
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
```
### Lazee Object
```ts
export interface LazeeReturnObject {
    /**
     * Return current value
     */
    value: () => any;
    /**
     * Return current item
     */
    item: () => any;
}
```

## Library files
This library written by `Typescript`, `SCSS` and use `Rollup` for bunder.

- `src/lazee.ts`: Source
- `src/lazee.scss`: Styles

### Build 
```sh
npm run build
```

### Dev mode
```sh
npm run dev
npm run scss
npm run rollup
```

---

Licensed under [MIT](http://amsul.ca/MIT)


