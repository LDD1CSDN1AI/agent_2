export function getSearchParams(query: any) {
  if (typeof window !== 'undefined') {
    const queryStr = window.location.search
    const queryContent = queryStr.indexOf('?')
    const content = queryStr.substring(queryContent + 1)
    const vars = content.split('&')
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      if (pair[0] === query)
        return decodeURIComponent(pair[1])
    }
    return null
  }
}

export function syntaxHighlight(json: any) {
  if (typeof json != 'string')
    json = JSON.stringify(json, undefined, 2)

  json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = 'color:#D19A66'
    if (match.startsWith('"')) {
      if (match.endsWith(':'))
        cls = 'color:#F92A0F'
      else
        cls = 'color:#44C91B'
    }
    else if (/true|false/.test(match)) {
      cls = 'color:#1B73C9'
    }
    else if (/null/.test(match)) {
      cls = 'color:#C586C0'
    }
    return `<span style=${cls}>${match}</span>`
  })
}
