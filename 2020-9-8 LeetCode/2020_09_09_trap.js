var trap = function(height) {
  let max=Math.max(...height)
  let result = 0
  let start = -1;
  while(max>=1){
      start = -1
      for(let i=0;i<height.length;i++){
          if(height[i] === max){
              if(start!==-1){
                  result+=i-1-start
              }
              start = i
              height[i] = max - 1
          }
      }
      max--
  }
  return result
};