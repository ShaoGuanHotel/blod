### 尺取法---解决带关键字："连续、最、子"问题---Javascript实现

- **往期推荐文章（希望各位看官有收获）**

  - [Lodash那些“多余”和让人眼前一亮的 API](https://juejin.im/post/5ed3cd366fb9a047f129c39a)
  - [Vue2.x对比Composition API写法](https://juejin.im/post/6844904132944330759)
  - [墙裂推荐：工欲善其事必先利其器(实际开发中高频使用)](https://juejin.im/post/6844904114971738119)
  - [JavaScript好用还未火的注解@Decorator（注解 | 装饰器 | 装潢器）](https://juejin.im/post/5eca298af265da77186a5869)

- **[本文git地址]()**

### 一、What & Where

尺取法（What），又名滑动窗口法，常见于获取连续相关的最值算法问题。如下Demo中的：长度最小的子数组、无重复字符的最长子串、最大连续1的个数 III等。

关键词为（Where）：**连续、最、子**。

**算法关键点**：

1.	何时推进端点
2.	如何推进端点
  3.	何时结束

弄清楚上面三个关键点，问题便能迎刃而解，且时间复杂度远小于暴力破解。**难点为关键点2：如何推进端点，特别是start端点的推进**。往往最佳答案随着各路好汉的脑洞大开产生，却难以理解，难以形成套路。尺取法不一定是运行时间最短和内存消耗最小的算法，只是有关键词：连续、最、子；这类问题用尺取法的套路能符合性能要求且较为快速解决。

### 二、Tempalte

下面总结的通用模板不一定是最佳，个人认为是最好理解的，欢迎各位斧正。

```	javascript
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
```



### 三、Demo

举一反三、下面三个Demo取自LeetCode，语言灵活的JavaScript。答案并非最佳答案，基本符合LeetCode执行用时和内存消耗的要求。

#### 1.[无重复字符的最长子串](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

**题目描述：**

	给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。

**示例：**

```
输入: "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

**算法关键点：**

1. 何时推进端点：每一步都需要推进：区间能找到下一个字符和找不到下一个字符都需要推进端点

2. 如何推进端点：

   end固定步伐推进（end++）；

   如果能找到下一个字符时候推进start（start += temp.findeIndex(arr[end])+1）

   ​	比如：temp为“abcdef”，下一个字符为“c”，则temp变化为"defc"；start指向“d”

  3. 何时结束：end<arr.length

画图太费神，简单打印了下端点变化，懂的人都懂。

01.png

**代码实现：**

``` javascript
const str = 'abcabcbb'
function getMaxLength(str = '') {
  // 1特殊情况处理
  if (str.length === 0) return 0 
  let start = 0
  let end = 0
  let max = 0
  const charts = [...str]
  while (end < charts.length) {
    // 2 截取区间
    const temp = charts.slice(start, end)
    const chart = charts[end]
    // 3 具体判断逻辑
    const findIndex = temp.indexOf(chart)
    end++ // 5
    // 4 何时推进端点
    if (findIndex !== -1) {
      // 5 如何推进
      // 如:temp为“abcdef”，下一个字符为“c” findIndex为2
      // 则temp变化为"defc"；start指向“d”
      start += findIndex + 1 
    }
    // 6 更新minOrMax
    if (end - start > max) {
      max = end - start
    }
  }
  return max
}
getMaxLength(str)
```



#### 2.[209. 长度最小的子数组](https://leetcode-cn.com/problems/minimum-size-subarray-sum/)

**题目描述：**

	给定一个含有 n 个正整数的数组和一个正整数 s ，找出该数组中满足其和 ≥ s 的长度最小的 连续 子数组，并返回其长度。如果不存在符合条件的子数组，返回 0。

**示例：**

```
输入：s = 7, nums = [2,3,1,2,4,3]
输出：2
解释：子数组 [4,3] 是该条件下的长度最小的子数组。
```

**算法关键点：**

1. 何时推进端点：每一步都需要推进：区间和大于或者和小于都需要推进端点

2. 如何推进端点：和小于s的时候推进end（end++）；和大于s的时候，end不动，推进start（start+=temp.findeIndex(arr[end])+1）

   和小于s如：[2,3,1]和小于7，则推进end，end指向下一个2

   和大于s如：[2,3,1,2]，则end不动，指向2；start推进一步，指向第一个3

  3. 何时结束：end<arr.length

**代码实现：**

``` javascript
// 1.给定一个序列，使得其和大于或等于S，求最短的子序列长度。
const nums = [2, 3, 1, 2, 4, 3]
let step = 0
function minSubArrayLen(s, nums) {
  const sumFn = (arr) => (arr.length ? arr.reduce((a, t) => (t += a)) : 0)
  // 1. 特殊情况处理
  if (sumFn(nums) < s) return 0
  let min = nums.length
  let start = 0
  let end = 0
  // 边界处理
  while (end <= nums.length) {
    // 2.区间截取
    const temp = nums.slice(start, end)
    // 3.结合otherParam判断
    const total = sumFn(temp)
    // 4.何时推进
    if (total >= s) {
      // 6.更新minOrMax 
      if (min > temp.length) {
        min = temp.length
      }
      // 和大于=s则end静止,推进start,同时因为区间变小,更新返回值
      // [2,3,1,2]，则end不动，指向2；start推进一步，指向第一个3
      // 5.推进start
      start++
    } else {
      // 5.和小于s,推进end,start静止
      end++
    }
  }
  return min
}
console.log('minSubArrayLen(7, nums)  ', minSubArrayLen(7, nums))
```



#### 3.[最大连续1的个数 III](https://leetcode-cn.com/problems/max-consecutive-ones-iii/)

**题目描述：**

	给定一个由若干 0 和 1 组成的数组 A，我们最多可以将 K 个值从 0 变成 1 。
	
	返回仅包含 1 的最长（连续）子数组的长度。

**示例：**

```
输入：A = [1,1,1,0,0,0,1,1,1,1,0], K = 2
输出：6
		 [1,1,1,0,0,1,1,1,1,1,1]
可见最长的子数组长度为 6。
```



**答案一算法关键点：**

答案一套用模板，思路简单；**但是运行时间不符合**

1.	何时推进端点：每一步都需要推进：区间0个数变化的时候都需要推进端点
2.	如何推进端点：区间0个数小于等于K的时候推进end（end++）；区间0个数大于K的时候，end不动，推进start（start++）
   1.	0个数小于等于2如：[1,1,1,0,0] 0个数为2，则推进end，end指向第三个0
   2.	0个数大于2如：[1,1,1,0,0,0]，则end不动，end指向第三个0；start推进一步，指向第一个1，区间缩短为[1,1,0,0,0]；
  3.	何时结束：end<arr.length

**答案一实现**

``` javascript
/**
 * @param {number[]} A
 * @param {number} K
 * @return {number}
 */
var longestOnes = function (A, K) {
  let start = 0
  let end = 0
  let max = 0
  const ALength = A.length
  const Zero = (num) => !Boolean(num)
  while (end < ALength) {
    // 2
    const temp = A.slice(start, end)
    // 3
    const numberOf0 = temp.filter(Zero).length

    // 4
    if (numberOf0 > K) {
      start++ // 5
      if (max < end - start + 1) {
        max = end - start + 1 // 6
      }
    } else {
      end++ // 5
    }
  }
  return max
}

```

**答案二算法关键点：**

不难发现答案一有**很多推进步骤是可以跳过**的，因此改进了算法，大致思想和上面模板一样，只是没有做切取的操作。

1.	何时推进端点：end固定推进，start依据情况而定
2.	如何推进端点：记录0出现的位置到zeroIndexs，当zeroIndexs长度大于K，start跳到第一个zeroIndex下一个位置
  3.	何时结束：end<arr.length

**答案二实现**

``` javascript
/**
 * @param {number[]} A
 * @param {number} K
 * @return {number}
 */
var longestOnes = function (A, K) {
  // 1.
  if (A.every((item) => item === 0) && K === 0) return 0
  let start = 0
  let end = 0
  let zeroIndexs = []
  let max = 0
  const ALength = A.length
  while (end < ALength) {
    end++ // 5. end固定推进
    // 3
    if (zeroIndexs.length > K) {
      // [0,1,2,3,4,5,6,7,8,9,10]
      // [1,1,1,0,0,0,1,1,1,1,0] K = 2
      // 5. start指向当前位置后第一个0后面的位置
      // start第一次变化:从 0--> 跳到 4
      start = zeroIndexs.shift() + 1
    } else {
      // 6
      if (max < end - start) {
        max = end - start
      }
    }
    if (!Boolean(A[end])) {
      // 为0
      zeroIndexs.push(end) // 记录0的位置,用于跳转start
    }
  }
  return max
}

```

#### 其他可用尺取法的Demo

欢迎补充，答案就不一一穷举了

1. [字符串的排列](https://leetcode-cn.com/explore/interview/card/bytedance/242/string/1016/)
2. [最长公共前缀](https://leetcode-cn.com/explore/interview/card/bytedance/242/string/1014/)



### 参考资料

[Leetcode刷题总结之滑动窗口法（尺取法）](https://zhuanlan.zhihu.com/p/61564531)

[尺取法 — 详解 + 例题模板(全)](https://blog.csdn.net/lxt_lucia/article/details/81091597)