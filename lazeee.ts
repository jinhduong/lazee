import { LazeeConfig } from "./models/lazee.config";
import { debounce } from "./utils/utils";
/**
 * 
 * @param selector selector query, default is get firsst element
 * @param config 
 */
const Lazee = function (selector: string, config?: LazeeConfig) {

    // Update config
    const defaultConfig: LazeeConfig = {
        debounceTime: 100,
        onfocus: null,
        outfocus: null,
        press: null,
    }
    config = Object.assign(defaultConfig, config);

    let elems = document.querySelectorAll(selector);
    if (!elems)
        throw new Error(`The select [${selector}] is empty `);

    const $elem: Element = elems[0];
    const $input = renderInput($elem, config);
}

function renderInput(elem: Element, config: LazeeConfig) {
    const $input = document.createElement('input');

    // Bind events
    $input.onfocus = function () {
        if (config.onfocus) config.onfocus(this);
        elem.classList.add('open');
    };
    $input.onblur = function () {
        if (config.outfocus) config.outfocus(this);
        elem.classList.remove('open');
    };
    $input.addEventListener('keyup', debounce((e) => {
        e.preventDefault();
        const _curval = $input.value;
        if (config.press) config.press(_curval, e);
    }, config.debounceTime));

    elem.appendChild($input);
    return $input;
}

const $autoComplete = new Lazee('div', {
    onfocus: (el) => console.log('onfocus', el),
    outfocus: (el) => console.log('outfocus', el)
});

