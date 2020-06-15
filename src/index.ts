import {
    getOptions
} from 'loader-utils';

type loaderParams = {
    /**
     * 组件放置文件夹名称
     */
    componentDirectory: string
    /**
     * 样式放置文件夹名称
     */
    styleDirectory: string
    /**
     * 是否使用style.js引入
     */
    styleJs: boolean
}

const getComponentName = (component: string) => {
    const arr = component.trim().split('');
    /** 首字母 */
    const acronym = arr[0]?.toLocaleLowerCase();
    arr.splice(0, 1);
    const fileName = acronym + arr.join('');
    const newFileName = fileName.replace(/[A-Z]/g, function (a) { return `-${a.toLocaleLowerCase()}`; });
    return newFileName;
}

/**
 * 
 * @param source 源代码
 * @param libraryName 组件库名称
 * @param options 配置参数
 */
const build = (source: string, libraryName: string, options: loaderParams | string) => {
    const importReg = new RegExp(`import[\\s]{0,1}[\\{][^\\{\\}]+[\\}][\\s]{0,1}from[\\s]{0,1}[\\'\\"]${libraryName}[\\'\\"][\\;]{0,1}`, "g");
    const componentDirectory = typeof options === 'string' ? options : options.componentDirectory;
    source = source.replace(importReg, (name) => {        
        const matchReg = new RegExp(`[\\{][^\\{\\}]+[\\}]`, 'g');
        let items = name.match(matchReg);
        let resultItemStr = items ? items[0] : '';
        let resultList = new Array();
        resultItemStr = resultItemStr.replace(/[\{|\}]/g, '').trim();
        let list = resultItemStr.split(',');
        list.map(component => {
            const val = component.trim();
            if (val === '') return;
            const componentFileName = getComponentName(component);
            let styleDirectory = '';
            if (typeof options === 'string') {
                styleDirectory = `${libraryName}/${options}/${componentFileName}/style`;
            } else {
                styleDirectory = `${libraryName}/${options.styleDirectory}/${options.styleJs ? `${componentFileName}/style` : `${componentFileName}.css`}`;
            }
            resultList.push(`\nimport ${component} from '${libraryName}/${componentDirectory}/${componentFileName}';\nimport '${styleDirectory}';\n`);
        });
        return resultList.join('');
    })
    return source;
}

const main = function (source: string) {
    var options: any = getOptions(this) || new Object();
    const libraryNames = options.libraryName;
    const libraryParams = options.libraryParams || new Object();
    if (!libraryNames) {
        return source;
    }
    /**
     * 单个组件使用
     */
    if (typeof libraryNames === 'string') {
        source = build(source, libraryNames, libraryParams);
    }
    /**
     * 多个组件同时使用时
     */
    if (libraryNames instanceof Array) {
        libraryNames.forEach(name => {
            source = build(source, name, libraryParams[name]);
        });
    }
    return source;
}

module.exports = main;