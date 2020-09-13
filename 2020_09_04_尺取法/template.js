// 尺取法模板
function getMaxOrMinByRule(arr,otherParam){
    // 1. 参数特殊情况处理:空数组、不符合循环等情况
    let minOrMax
    let start
    let end
    while(end<arr.length){ 
      // 2. 截取区间,用于做进一步判断;
      const sliceArr = arr.slice(start,end) 

      // 3. 具体判断逻辑结合otherParam
      // 此处多用includes,indexOf,filter,every等去判断
      const condition = sliceArr.filter(...)

      // 4. 何时推进端点
      if(condition){
        // 5. 如何推进端点
      }else{
        // 5. 如何推进端点
      }

      // 6. 更新minOrMax,可能在端点变化前处理,也可能在端点变化后处理

    }
    return minOrMax
}