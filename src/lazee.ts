import { LazeeConfig } from "../models/lazee.config";
import { debounce, isPromise } from "../utils/utils";
import { consts } from "../utils/consts";
import { LazeeReturnObject } from "../models/lazee.return";
declare var window;
/**
 * 
 * @param selector selector query, default is get firsst element
 * @param config 
 */
const Lazee = function (selector: string, config?: LazeeConfig): LazeeReturnObject {
    // Update config
    const defaultConfig: LazeeConfig = {
        debounceTime: 50,
        wordLen: 1
    }

    if (!config.getData) throw Error('You need to define getData function');

    config = Object.assign(defaultConfig, config || {});

    let elems = document.querySelectorAll(selector);
    if (!elems)
        throw new Error(`The select [${selector}] is empty `);

    const $elem: Element = elems[0]; $elem.classList.add('lazee');
    const $input = renderInput($elem, config);

    return {
        value: () => $input.value,
        item: () => $input[consts.SELFPROP]
    }
}

/**
 * Render the auto-complete input
 * @param elem Container elem
 * @param config The config
 */
function renderInput(elem: Element, config: LazeeConfig) {
    const $input = document.createElement('input');
    let idx = -1; // Store the order number of current select index
    let curItem;

    // Bind events
    // onfocus
    $input.onfocus = function () {
        if (config.onfocus) config.onfocus(this);
    };

    // outfocus
    $input.onblur = function () {
        if (config.outfocus) config.outfocus(this);
        elem.classList.remove('open');
        hideSuggesstion(elem);
    };

    // keyup
    $input.addEventListener('keyup', debounce((e) => {
        e.preventDefault();
        if (e.keyCode === consts.DOWN
            || e.keyCode === consts.UP
            || e.keyCode === consts.ENTER) return;

        if (e.keyCode === consts.ESC) {
            hideSuggesstion(elem);
        }

        const _curval = $input.value;
        if (config.typing) config.typing(_curval, e);
        if (config.getData) {
            const _data = config.getData(_curval);
            if (isPromise(_data))
                (_data as Promise<any[]>).then(data => _doRender(data));
            else
                _doRender(_data as any[]);
        }

        function _doRender(data) {
            idx = -1;
            elem.classList.add('open');
            if (_curval.length >= config.wordLen)
                renderSugesstion(elem, config, data, (selectedItem) => {
                    $input.value = getValue(selectedItem, config);
                });
        }

    }, config.debounceTime));

    // enter

    $input.addEventListener('keydown', (e) => {
        if (e.keyCode === consts.ENTER) {
            const _curval = $input.value;
            if (config.enter) config.enter(_curval, e);
            if (curItem) {
                $input.value = getValue(curItem, config);
                hideSuggesstion(elem);
            }
        } else if (e.keyCode === consts.DOWN || e.keyCode === consts.UP) {
            const isDownKey = e.keyCode === consts.DOWN;
            idx = selectSuggesttionItems(elem, idx, isDownKey, (item) => {
                curItem = item;
                $input[consts.SELFPROP] = item;
            });
        }
    });

    elem.appendChild($input);
    return $input;
}

/**
 * Hide suggesstion containder
 * IMPORTANT: If don't have setTimeout here
=> the suggestion container will be display:none before <li>.<a> was be clicking.
=> It mean the trigger of <li>.<a> will not fire 
 */
function hideSuggesstion(elem: Element) {
    setTimeout(() => {
        let $suggesstion: HTMLDivElement =
            elem.querySelectorAll(`.${consts.SUGGESSTION_CLASS}`)[0] as HTMLDivElement;
        if ($suggesstion) $suggesstion.style.display = 'none';
        elem.classList.remove('open');
    }, 100);
}

function selectSuggesttionItems(elem: Element, index: number, isDown: boolean, enterItem?: (item: any) => void) {
    let $lis = elem.querySelectorAll(`.${consts.SUGGESSTION_CLASS} li`);
    if ($lis && (index >= 0 || index === -1 && isDown) && index <= $lis.length - 1) {
        if (isDown && index < $lis.length - 1) index++;
        else if (!isDown && index > 0) index--;

        $lis.forEach(li => li.classList.remove('sl'));
        $lis[index] && $lis[index].classList.add('sl');
        enterItem && enterItem($lis[index][consts.SELFPROP]);
    }
    return index;
}

function getValue(item: any | string, config: LazeeConfig) {
    if (config.displayProp) return item[config.displayProp];
    return item;
}

/**
 * Render suggestion container
 * @param elem Root container element
 * @param config The config
 * @param data The sync data
 */
function renderSugesstion(elem: Element, config: LazeeConfig, data: any[], selected: (selectedItem) => void) {
    let $suggesstion: HTMLDivElement =
        elem.querySelectorAll(`.${consts.SUGGESSTION_CLASS}`)[0] as HTMLDivElement;

    // Create at first time
    if (!$suggesstion) {
        const $div = document.createElement('div');
        $div.classList.add('lazee-suggestion');
        $suggesstion = $div;
        elem.appendChild($div);
    } else {
        if ($suggesstion.style.display) $suggesstion.style.display = null;
        removeChilds($suggesstion);
    }

    const $ul = renderSugesstionItems(config, data, selected);
    $suggesstion.appendChild($ul);
}

/**
 * Remove all old suggesstion items
 * @param elem Suggestion container
 */
function removeChilds(elem: Element) {
    while (elem.hasChildNodes())
        elem.removeChild(elem.firstChild);
}

/**
 * Render <li> suggesstion items
 * @param config The config
 * @param data The sync source
 */
function renderSugesstionItems(config: LazeeConfig, data: any[], selected: (selectedItem) => void) {
    const $ul = document.createElement('ul');
    data.forEach(item => {
        const $li = document.createElement('li');
        const $a = document.createElement('a');

        $li.addEventListener('click', (e) => {
            e.preventDefault();
            if (config.itemClick) config.itemClick(item);
            selected(item);
        });

        if (config.displayProp) $a.text = item[config.displayProp];
        $li[consts.SELFPROP] = item;
        $li.appendChild($a);
        $ul.appendChild($li);
    });
    return $ul;
}

window.Lazee = Lazee;

// const $autoComplete = new Lazee('div', {
//     debounceTime: 200,
//     getData: (val) => {
//         let arr = [
//             { word: '123sdfdfsdfsd', id: 123 },
//             { word: '123dfkjglkewifdjn', id: 123 },
//             { word: '123cvbcvbcvbcv', id: 123 },
//             { word: '123wqweqweqw', id: 123 },
//             { word: '123uyiyuiyuiyu', id: 123 },
//             { word: '123bnmbnmnbmbn', id: 123 },
//             { word: '879', id: 123 },
//             { word: 'asdsadsa', id: 123 },
//             { word: 'ghjgh', id: 123 }
//         ]
//         return arr.filter(x => x.word.includes(val));
//     },
//     displayProp: 'word'
// });

