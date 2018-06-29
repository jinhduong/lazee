$(function () {
    Object.assign = function mergeObjects() {
        var resObj = {};
        for (var i = 0; i < arguments.length; i += 1) {
            var obj = arguments[i],
                keys = Object.keys(obj);
            for (var j = 0; j < keys.length; j += 1) {
                resObj[keys[j]] = obj[keys[j]];
            }
        }
        return resObj;
    }
    var $autoComplete = new Lazee('#elem', {
        debounceTime: 200,
        getData: function (val) {
            var arr = [
                { word: '123sdfdfsdfsd', id: 123 },
                { word: '123dfkjglkewifdjn', id: 123 },
                { word: '123cvbcvbcvbcv', id: 123 },
                { word: '123wqweqweqw', id: 123 },
                { word: '123uyiyuiyuiyu', id: 123 },
                { word: '123bnmbnmnbmbn', id: 123 },
                { word: '879', id: 123 },
                { word: 'asdsadsa', id: 123 },
                { word: 'ghjgh', id: 123 }
            ]
            return arr.filter(x, function () { return x.word.includes(val) });
        },
        displayProp: 'word'
    });
    var elem = document.getElementById('elem');
    var input = document.querySelectorAll('input')[0];
    test("ui test", function (assert) {
        equal(elem != null, true, "init elem");
        equal(input != null, true, "init input");
    });
});