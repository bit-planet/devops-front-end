function buildOptionMethod(methodName, model, methodList, scheme) {
  const config = scheme.__config__
  const str = `${methodName}() {
        // 注意：this.$axios是通过Vue.prototype.$axios = axios挂载产生的
        this.$request({
          method: '${config.method}',
          url: '${config.url}'
        }).then(resp => {
          this.${model} = resp.${config.dataPath}
        })
      },`
  methodList.push(str)
}


function toHump(input,project) {
  if (project.tablePrefix && project.tablePrefix.length > 0) {
    // 去除前缀
    console.log(project.tablePrefix)
    for(let i in project.tablePrefix) {
      let pre = project.tablePrefix[i];
      input = input.replace(new RegExp("^" + pre +"_"), "");
      console.log("结束"+ input)
    }
  }
  return input.toLowerCase().replace(/([_\s])(.)/g,function(match,separator,starter) {
    return starter.toUpperCase();
  });
}

exports.buildOptionMethod = buildOptionMethod;
exports.toHump = toHump;
