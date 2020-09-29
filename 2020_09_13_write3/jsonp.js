const getUrlParams = (params = {}) => {
  const str = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return str ? `&${str}` : ''
}

const jsonp = ({ url, params, callbackName }) => {
  return new Promise((resolve, reject) => {
    url += getUrlParams(params)
    const scriptDom = document.createElement('script')
    scriptDom.src = url
    document.body.appendChild(scriptDom)

    window[callbackName] = (data) => {
      resolve(data)
      document.body.removeChild(scriptDom)
      delete window[callbackName]
    }
  })
}
