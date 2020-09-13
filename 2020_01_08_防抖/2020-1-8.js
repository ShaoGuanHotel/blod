/**
 * 简单防抖(延时防抖)
 * 适用场景：
 *  1. 搜索框动态搜索，搜索值变化的时候调用接口；
 *  2. 滚动ajax加载数据等
 * @param {function} func           防抖函数
 * @param {number} wait             防抖时间间隔
 * @return {function}               返回客户调用函数
 */
function laterDebounce(func, wait = 50) {
    let timer = 0
    return function (...params) {
        timer && clearTimeout(timer)
        timer = setTimeout(() => func.apply(this, params), wait)
    }
}

/**
 * 立刻执行防抖
 * @param {function} func           防抖函数
 * @param {number} wait             防抖时间间隔
 * @return {function}               返回客户调用函数
 */
function immediateDebounce(func, wait = 50) {
    let timer
    let isRepeat = false // 是否重复点击
    const later = () => setTimeout(() => {
        isRepeat = false // 延时wait后 isRepeat=false，timer=null，便可以调用函数
        timer = null
    }, wait)

    return function (...params) {
        if (!timer && !isRepeat) { // isRepeat=false，timer=null，便可以调用函数
            func.apply(this, params)
        } else {
            isRepeat = true
        }
        timer && clearTimeout(timer)
        timer = later()
    }
}

/**
 * 可配置防抖函数
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */
function debounce(func, wait = 50, immediate = true) {
    return immediate ? immediateDebounce(func, wait) : laterDebounce(func, wait)
}

/**
 * 可配置防抖函数
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */
function debounce(func, wait = 50, immediate = true) {
    let timer, context, args
    // 延迟执行函数
    const later = () => setTimeout(() => {
        // 延迟函数执行完毕，清空缓存的定时器序号
        timer = null
        // 延迟执行的情况下，函数会在延迟函数中执行
        // 使用到之前缓存的参数和上下文
        if (!immediate) {
            func.apply(context, args)
            context = args = null
        }
    }, wait)

    // 这里返回的函数是每次实际调用的函数
    return function (...params) {
        // 如果没有创建延迟执行函数（later），就创建一个
        if (!timer) {
            timer = later()
            // 如果是立即执行，调用函数
            // 否则缓存参数和调用上下文
            if (immediate) {
                func.apply(this, params)
            } else {
                context = this
                args = params
            }
            // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
            // 这样做延迟函数会重新计时
        } else {
            clearTimeout(timer)
            timer = later()
        }
    }
}