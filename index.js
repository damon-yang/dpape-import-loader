const { getOptions } = require('loader-utils');
/**
 * 
 * @param {*} source 源代码
 * @param {*} moduleName 组件库名称
 * @param {*} options 参数
 */
var build = function(source, moduleName, options) {
    const importReg = new RegExp(`import[\\s+][\\{][\\w\\s\\,\\r\\n]*[\\}][\\s+]from[\\s+][\\'|\\"]${moduleName}[\\'|\\"][\\s+]?;`, "g");
    source = source.replace(importReg, function(a) {
        const components = a.split(/[\{|\}]/)[1].split(',');
        let singleResult = '';
        components.map(v => {
            const name = (v + '').trim();
            if (!v) return;
            const arr = name.split('');
            /** 首字母 */
            const acronym = (arr[0] || '').toLocaleLowerCase();
            arr.splice(0, 1);
            const fileName = acronym + arr.join('');
            const newFileName = fileName.replace(/[A-Z]/g, function(a) { return `-${a.toLocaleLowerCase()}`; });
            var componentPath = '';
            var stylePath = '';
            if (typeof options === 'string') {
                componentPath = `${options}/${newFileName}/index`;
                stylePath = `${options}/${newFileName}/style`;
            }
            if (typeof options === 'object') {
                var cssType = options.css ? (options.style ? `${newFileName}/style.css` : `${newFileName}.css`) : `${newFileName}/style`;
                componentPath = `${options.componentName || 'lib'}/${newFileName}`;
                stylePath = `${options.styleLibraryName || 'lib'}/${cssType}`;
            }
            singleResult += `\nimport ${name} from '${moduleName}/${componentPath}';`;
            singleResult += `\nimport '${moduleName}/${stylePath}';`;
        });
        return singleResult;
    })
    return source;
};

/**
 * 主方法
 * @param {*} source 源代码
 */
var fn = function(source) {
    var options = getOptions(this) || new Object();
    const moduleNames = options.libraryName === undefined ? 'vue-dyangui' : options.libraryName;
    const libraryDirectory = options.libraryDirectory === undefined ? 'lib' : options.libraryDirectory;
    /**
     * 单个组件使用
     */
    if (typeof moduleNames === 'string') {
        source = build(source, moduleNames, libraryDirectory);
    }
    /**
     * 多个组件同时使用时
     */
    if (moduleNames instanceof Array) {
        moduleNames.forEach(function(name) {
            var params = typeof libraryDirectory === 'object' ? libraryDirectory[name] : undefined;
            if (params === undefined) return;
            source = build(source, name, params);
        });
    }
    return source;
};

module.exports = fn;