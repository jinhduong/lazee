(function () {
    'use strict';

    function debounce(func, wait, immediate) {
        if (immediate === void 0) { immediate = false; }
        var timeout, args, context, timestamp, result;
        if (null == wait)
            wait = 100;
        function later() {
            var last = Date.now() - timestamp;
            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            }
            else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    context = args = null;
                }
            }
        }
        var debounced = function () {
            context = this;
            args = arguments;
            timestamp = Date.now();
            var callNow = immediate && !timeout;
            if (!timeout)
                timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }
            return result;
        };
        debounced.clear = function () {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
        };
        debounced.flush = function () {
            if (timeout) {
                result = func.apply(context, args);
                context = args = null;
                clearTimeout(timeout);
                timeout = null;
            }
        };
        return debounced;
    }
    function isPromise(obj) {
        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    }

    var consts = {
        ENTER: 13,
        SUGGESSTION_CLASS: 'lazee-suggestion',
        DOWN: 40,
        UP: 38,
        SELFPROP: '__lazee',
        ESC: 27
    };

    /**
     *
     * @param selector selector query, default is get firsst element
     * @param config
     */
    var Lazee = function (selector, config) {
        // Update config
        var defaultConfig = {
            debounceTime: 50,
            wordLen: 1
        };
        config = Object.assign(defaultConfig, config);
        var elems = document.querySelectorAll(selector);
        if (!elems)
            throw new Error("The select [" + selector + "] is empty ");
        var $elem = elems[0];
        $elem.classList.add('lazee');
        var $input = renderInput($elem, config);
    };
    /**
     * Render the auto-complete input
     * @param elem Container elem
     * @param config The config
     */
    function renderInput(elem, config) {
        var $input = document.createElement('input');
        // Bind events
        // onfocus
        $input.onfocus = function () {
            if (config.onfocus)
                config.onfocus(this);
        };
        // outfocus
        $input.onblur = function () {
            if (config.outfocus)
                config.outfocus(this);
            elem.classList.remove('open');
            hideSuggesstion(elem);
        };
        // keyup
        $input.addEventListener('keyup', debounce(function (e) {
            e.preventDefault();
            if (e.keyCode === consts.DOWN
                || e.keyCode === consts.UP
                || e.keyCode === consts.ENTER)
                return;
            if (e.keyCode === consts.ESC) {
                hideSuggesstion(elem);
            }
            var _curval = $input.value;
            if (config.typing)
                config.typing(_curval, e);
            if (config.getData) {
                var _data = config.getData(_curval);
                if (isPromise(_data))
                    _data.then(function (data) { return _doRender(data); });
                else
                    _doRender(_data);
            }
            function _doRender(data) {
                elem.classList.add('open');
                if (_curval.length >= config.wordLen)
                    renderSugesstion(elem, config, data, function (selectedItem) {
                        $input.value = getValue(selectedItem, config);
                    });
            }
        }, config.debounceTime));
        // enter
        var idx = -1;
        var curItem;
        $input.addEventListener('keydown', function (e) {
            if (e.keyCode === consts.ENTER) {
                var _curval = $input.value;
                if (config.enter)
                    config.enter(_curval, e);
                if (curItem) {
                    $input.value = getValue(curItem, config);
                    hideSuggesstion(elem);
                }
            }
            else if (e.keyCode === consts.DOWN || e.keyCode === consts.UP) {
                var isDownKey = e.keyCode === consts.DOWN;
                idx = selectSuggesttionItems(elem, idx, isDownKey, function (item) { return curItem = item; });
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
    function hideSuggesstion(elem) {
        setTimeout(function () {
            var $suggesstion = elem.querySelectorAll("." + consts.SUGGESSTION_CLASS)[0];
            if ($suggesstion)
                $suggesstion.style.display = 'none';
            elem.classList.remove('open');
        }, 100);
    }
    function selectSuggesttionItems(elem, index, isDown, enterItem) {
        var $lis = elem.querySelectorAll("." + consts.SUGGESSTION_CLASS + " li");
        if ($lis && (index >= 0 || index === -1 && isDown) && index <= $lis.length - 1) {
            if (isDown && index < $lis.length - 1)
                index++;
            else if (!isDown && index > 0)
                index--;
            $lis.forEach(function (li) { return li.classList.remove('sl'); });
            $lis[index] && $lis[index].classList.add('sl');
            enterItem && enterItem($lis[index][consts.SELFPROP]);
        }
        return index;
    }
    function getValue(item, config) {
        if (config.displayProp)
            return item[config.displayProp];
        return item;
    }
    /**
     * Render suggestion container
     * @param elem Root container element
     * @param config The config
     * @param data The sync data
     */
    function renderSugesstion(elem, config, data, selected) {
        var $suggesstion = elem.querySelectorAll("." + consts.SUGGESSTION_CLASS)[0];
        // Create at first time
        if (!$suggesstion) {
            var $div = document.createElement('div');
            $div.classList.add('lazee-suggestion');
            $suggesstion = $div;
            elem.appendChild($div);
        }
        else {
            if ($suggesstion.style.display)
                $suggesstion.style.display = null;
            removeChilds($suggesstion);
        }
        var $ul = renderSugesstionItems(config, data, selected);
        $suggesstion.appendChild($ul);
    }
    /**
     * Remove all old suggesstion items
     * @param elem Suggestion container
     */
    function removeChilds(elem) {
        while (elem.hasChildNodes())
            elem.removeChild(elem.firstChild);
    }
    /**
     * Render <li> suggesstion items
     * @param config The config
     * @param data The sync source
     */
    function renderSugesstionItems(config, data, selected) {
        var $ul = document.createElement('ul');
        data.forEach(function (item) {
            var $li = document.createElement('li');
            var $a = document.createElement('a');
            $li.addEventListener('click', function (e) {
                e.preventDefault();
                if (config.itemClick)
                    config.itemClick(item);
                selected(item);
            });
            if (config.displayProp)
                $a.text = item[config.displayProp];
            $li[consts.SELFPROP] = item;
            $li.appendChild($a);
            $ul.appendChild($li);
        });
        return $ul;
    }
    window.Lazee = Lazee;

}());
