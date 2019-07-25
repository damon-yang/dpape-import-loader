const { getOptions } = require('loader-utils');

const buildLibrar = (source,moduleName,global,libraryDirectory) => {
  if(global){
    var allReg = new RegExp(`import[\\s+][\\w]*[\\s+]from[\\s+][\\'|\\"]${moduleName}[\\'|\\"][\\s+]?;`,"g");
    source = source.replace(allReg,function(a){
      const gcss = `\nimport '${moduleName}/${libraryDirectory}/index.css';`;
      return a+gcss;
    });
  }else{
    const importReg = new RegExp(`import[\\s+][\\{][\\w\\s\\,]*[\\}][\\s+]from[\\s+][\\'|\\"]${moduleName}[\\'|\\"][\\s+]?;`,"g");          
    source = source.replace(importReg,function(a){      
      const components = a.split(/[\{|\}]/)[1].split(',');  
      let singleResult = '';
      components.map(v=>{
        const name = (v + '').trim();
        const arr = name.split('');
        /** 首字母 */
        const acronym = (arr[0] || '').toLocaleLowerCase();
        arr.splice(0,1);
        const fileName = acronym + arr.join('');
        const newFileName = fileName.replace(/[A-Z]/g,function(a){return `-${a.toLocaleLowerCase()}`;})
        singleResult += `\nimport ${name} from '${moduleName}/${libraryDirectory}/${newFileName}/index';`
        singleResult += `\nimport '${moduleName}/${libraryDirectory}/${newFileName}/style';`
      });
      return singleResult;
    })
  }
  return source;
}

module.exports = function(source){
    /**
     * 获取loader参数
     */
    const options = getOptions(this) || new Object();
    const isGlobal = options.global === undefined ? true : options.global;
    const moduleName = options.libraryName === undefined ? 'vue-dyangui' : options.libraryName;
    const libraryDirectory = options.libraryDirectory === undefined ? 'lib' : options.libraryDirectory;
    if(typeof moduleName === 'string') source = buildLibrar(source,moduleName,isGlobal,(typeof libraryDirectory === 'object' ? 'lib' : libraryDirectory));
    if(moduleName instanceof Array){      
      moduleName.map(v=>{
        const directoryName = typeof libraryDirectory === 'object' ? (libraryDirectory[v] || 'lib') : libraryDirectory; 
        source = buildLibrar(source,v,isGlobal,directoryName);
      });
    }
    return source;
}