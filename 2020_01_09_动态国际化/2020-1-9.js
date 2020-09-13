// 模拟国际化
const lang = {
    data: {
        zh: {},
        en: {},
        ['客家话']: {}
    },
    current: 'zh',
    getLang(key) {
        const {
            data,
            current
        } = this
        return data[current][key] || key
    },
    setLang(language = 'zh') {
        this.current = language
    },
    getCurrent() {
        return this.current
    }
}

function badSolution(lan) {
    lan && lang.setLang(lan)
    const language = lang.getCurrent()
    let showMessage = ''
    const notFound = ['布加迪威龙', 'LV', '《点赞JS强迫症患者》']
    switch (language) {
        case 'zh':
            showMessage = `您购物车中的${notFound.join('、')}已下架，请重新加入购物车`;
            break
        case 'en':
            showMessage = `${notFound.join(',')} in your shopping cart have been removed, please re-add to the shopping cart`;
            break
        case '客家话':
            showMessage = `渔买给${notFound.join('、')}某A，嗯该从新买`;
            break
    }
    return showMessage
}
console.log('badSolution-zh : ', badSolution('zh'))
console.log('badSolution-en : ', badSolution('en'))
console.log('badSolution-客家话 : ', badSolution('客家话'))

function solution(lan) {
    lan && lang.setLang(lan)
    // 增加模拟数据，实际开发过程中在国际化文件中配置
    lang.data = {
        zh: {
            notFound: `您购物车中的notFound已下架，请重新加入购物车`,
            join: '、'
        },
        en: {
            notFound: `notFound in your shopping cart have been removed, please re-add to the shopping cart`,
            join: ','
        },
        ['客家话']: {
            notFound: `渔买给notFound某A，嗯该从新买`,
            join: '、'
        }
    }

    const notFound = ['布加迪威龙', 'LV', '《点赞JS强迫症患者》']
    return lang.getLang('notFound').replace('notFound', notFound.join(lang.getLang('join')))
}
console.log('solution-zh : ', solution('zh'))
// solution-zh :  您购物车中的布加迪威龙、LV、《点赞JS强迫症患者》已下架，请重新加入购物车
console.log('solution-en : ', solution('en'))
// solution-en :  布加迪威龙,LV,《点赞JS强迫症患者》 in your shopping cart have been removed, please re-add to the shopping cart
console.log('solution-客家话 : ', solution('客家话'))
// solution-客家话 :  渔买给布加迪威龙、LV、《点赞JS强迫症患者》某A，嗯该从新买

function solutions(lan) {
    lan && lang.setLang(lan)
    // 增加模拟数据，实际开发过程中在国际化文件中配置
    lang.data = {
        zh: {
            SectionEmpty: `Section栏目中的cantEmpty不能为空`,
            join: '、'
        },
        en: {
            SectionEmpty: `cantEmpty in the Section column cannot be empty`,
            join: ','
        },
        ['客家话']: {
            SectionEmpty: `Section栏目中给cantEmpty嗯扣以空`,
            join: '、'
        }
    }

    const notFound = ['AAA', 'BBB', 'CCC']
    const section = '个人信息'
    return lang.getLang('SectionEmpty')
        .replace('cantEmpty', notFound.join(lang.getLang('join')))
        .replace('Section', section)
}

console.log('solutions-zh : ', solutions('zh'))
// solutions-zh :  个人信息栏目中的AAA、BBB、CCC不能为空
console.log('solutions-en : ', solutions('en'))
// solutions-en :  AAA,BBB,CCC in the 个人信息 column cannot be empty
console.log('solutions-客家话 : ', solutions('客家话'))
// solutions-客家话 :  个人信息栏目中给AAA、BBB、CCC嗯扣以空


function isUndefined(val) {
    return Object.prototype.toString.call(val).includes('Undefined')
}

/**
 * 传入'a.b'得到context.a.b
 * @param {string} link 
 * @param {object} context 
 */
function getValueByKeyLink(link = '', context = {}) {
    const keys = link.split('.')
    let nextContext = JSON.parse(JSON.stringify(context)) // 为了不影响外部参数，简单深拷贝
    let isFound = true
    keys.forEach(key => {
        if (!isUndefined(nextContext[key])) {
            nextContext = nextContext[key]
        } else {
            isFound = false
        }
    })
    return isFound ? nextContext : undefined
}

/**
 * 字符串模板根据上下文替换
 * demo:
 ;
(() => {
    const str = `
    { util } is helpful, { name} can try it.
    {util} is wanderful, {name} must try it!
    It also can replace c.cc to { c.cc }.
    If no match,It would't replace {notFound} or { c. cc}
    `
    const context = {
        util: 'replaceByContext',
        name: 'you',
        c: {
            cc: 'CCC'
        }
    }
    console.log(replaceByContext(str, context))
    // replaceByContext is helpful, you can try it.
    // replaceByContext is wanderful, you must try it!
    // It also can replace c.cc to CCC.
    // If no match,It would't replace {notFound} or { c. cc}
})();
 * @param {string} str 字符串模板 
 * @param {object} context 上下文
 */
function replaceByContext(str = '', context = {}) {
    const reg = /{\s*([A-Za-z0-9\\.\\_]+)\s*}/g
    //                  去重        匹配                       去空格
    const matchs = [...new Set(str.match(reg).map(item => item.replace(/\ /g, '')))]
    // [ '{util}', '{name}', '{c.cc}', '{notFound}' ]
    let replaceTime = matchs.length // 去重后找到4个合法的上下文，要替换4次
    while (replaceTime > 0) {
        replaceTime--
        reg.test(str)
        const keyStr = RegExp.$1
        const contextValue = getValueByKeyLink(keyStr, context)
        if (!isUndefined(contextValue)) { // 有值的时候才替换
            //                                 /{name}/g                'you'
            str = str.replace(new RegExp(`{\\s*${keyStr}\\s*}`, 'g'), contextValue)
        }
    }
    return str
}

function goodSolution(lan) {
    lan && lang.setLang(lan)
    // 增加模拟数据，实际开发过程中在国际化文件中配置
    lang.data = {
        zh: {
            SectionEmpty: `{ Section}栏目中的{notFounds}不能为空`,
            join: '、'
        },
        en: {
            SectionEmpty: `{notFounds} in the {Section} column cannot be empty`,
            join: ','
        },
        ['客家话']: {
            SectionEmpty: `{Section}栏目中给{notFounds}嗯扣以空`,
            join: '、'
        }
    }

    const notFounds = ['AAA', 'BBB', 'CCC']
    const context = {
        Section: '个人信息',
        notFounds: notFounds.join(lang.getLang('join')),
        c: {
            cc: 'aaaaa'
        }
    }
    return replaceByContext(lang.getLang('SectionEmpty'), context)
}

console.log('goodSolution-zh : ', goodSolution('zh'))
// goodSolution-zh :  个人信息栏目中的AAA、BBB、CCC不能为空
console.log('goodSolution-en : ', goodSolution('en'))
// goodSolution-en :  AAA,BBB,CCC in the 个人信息 column cannot be empty
console.log('goodSolution-客家话 : ', goodSolution('客家话'))
// goodSolution-客家话 :  个人信息栏目中给AAA、BBB、CCC嗯扣以空