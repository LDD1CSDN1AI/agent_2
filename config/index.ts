/* eslint-disable import/no-mutable-exports */
import { InputVarType } from '@/app/components/workflow/types'
import { AgentStrategy } from '@/types/app'
import { PromptRole } from '@/models/debug'
import GlobalUrl, { setDefaultUrlIp } from '@/GlobalUrl'

export let apiPrefix = ''
export let publicApiPrefix = ''
export let marketplaceApiPrefix = ''
export let marketplaceUrlPrefix = ''

console.log('process.env.NEXT_PUBLIC_API_PREFIX', process.env.NEXT_PUBLIC_API_PREFIX)
console.log('process.env.NEXT_PUBLIC_PUBLIC_API_PREFIX', process.env.NEXT_PUBLIC_PUBLIC_API_PREFIX)
console.log('globalThis.document?.body?.getAttribute(data-api-prefix)', globalThis.document?.body?.getAttribute('data-api-prefix'))

// NEXT_PUBLIC_API_PREFIX=/console/api NEXT_PUBLIC_PUBLIC_API_PREFIX=/api npm run start
if (process.env.NEXT_PUBLIC_API_PREFIX && process.env.NEXT_PUBLIC_PUBLIC_API_PREFIX) {
  console.log("工作流分支11111111111111111111111111111111111111111111")
  apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX
  publicApiPrefix = process.env.NEXT_PUBLIC_PUBLIC_API_PREFIX
}
else if (
  globalThis.document?.body?.getAttribute('data-api-prefix')
  && globalThis.document?.body?.getAttribute('data-pubic-api-prefix')
) {
  // Not build can not get env from process.env.NEXT_PUBLIC_ in browser https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
  apiPrefix = globalThis.document.body.getAttribute('data-api-prefix') as string
  publicApiPrefix = globalThis.document.body.getAttribute('data-pubic-api-prefix') as string
}
else {
  console.log("工作流分支33333333333333333333333333333333333333333333")

  if (typeof window !== 'undefined') {
    // Your code that uses window
    const url = window.location.href;

    const urlObj = new URL(url);

    // 提取主机名（IP 或域名）
    const hostname = urlObj.hostname;

    // 提取端口
    const port = urlObj.port;
    const shufa_url = "http://" + hostname + ":" + port;
    apiPrefix = shufa_url + '/console/api'
    publicApiPrefix = shufa_url + '/api'
    console.log("apiPrefix:", apiPrefix)
    console.log("publicApiPrefix:", publicApiPrefix)
    setDefaultUrlIp("http://" + hostname + ":" + port)
  } else {
    apiPrefix = GlobalUrl.defaultUrlIp + '/console/api'//新的ip地址
    publicApiPrefix = GlobalUrl.defaultUrlIp + '/api' //新的ip地址

  }


  // const domainParts = globalThis.location?.host?.split('.');
  // in production env, the host is dify.app . In other env, the host is [dev].dify.app
  // const env = domainParts.length === 2 ? 'ai' : domainParts?.[0];
  // apiPrefix = 'http://172.27.221.54:5001/agent-platform/console/api'//老的ip地址
  // publicApiPrefix = 'http://172.27.221.54:5001/agent-platform/api' // 老的ip地址
  apiPrefix = GlobalUrl.defaultUrlIp + '/console/api'//新的ip地址
  publicApiPrefix = GlobalUrl.defaultUrlIp + '/api' //新的ip地址
  //  if (process.env.NEXT_PUBLIC_API_PREFIX) {
  //         param = process.env.NEXT_PUBLIC_API_PREFIX;
  //       } else if (process.environment.NEXT_PUBLIC_API_PREFIX) {
  //         param = process.environment.NEXT_PUBLIC_API_PREFIX;
  //       } else {
  //         param = GlobalUrl.defaultUrlIp + '/console/api'
  //       }
}

if (process.env.NEXT_PUBLIC_MARKETPLACE_API_PREFIX && process.env.NEXT_PUBLIC_MARKETPLACE_URL_PREFIX) {
  marketplaceApiPrefix = process.env.NEXT_PUBLIC_MARKETPLACE_API_PREFIX
  marketplaceUrlPrefix = process.env.NEXT_PUBLIC_MARKETPLACE_URL_PREFIX
}
else {
  marketplaceApiPrefix = globalThis.document?.body?.getAttribute('data-marketplace-api-prefix') || ''
  marketplaceUrlPrefix = globalThis.document?.body?.getAttribute('data-marketplace-url-prefix') || ''
}

export const API_PREFIX: string = apiPrefix
export let textGenerationTimeoutMs = 60000
export const PUBLIC_API_PREFIX: string = publicApiPrefix
export const MARKETPLACE_API_PREFIX: string = marketplaceApiPrefix
export const MARKETPLACE_URL_PREFIX: string = marketplaceUrlPrefix
export const FULL_DOC_PREVIEW_LENGTH = 50

export const API_PREFIX2: string = apiPrefix.split('/console/api')[0]
const EDITION = process.env.NEXT_PUBLIC_EDITION || globalThis.document?.body?.getAttribute('data-public-edition') || 'SELF_HOSTED'
export const IS_CE_EDITION = EDITION === 'SELF_HOSTED'

export const SUPPORT_MAIL_LOGIN = !!(process.env.NEXT_PUBLIC_SUPPORT_MAIL_LOGIN || globalThis.document?.body?.getAttribute('data-public-support-mail-login'))

export const TEXT_GENERATION_TIMEOUT_MS = textGenerationTimeoutMs

export const ENABLE_WEBSITE_JINAREADER = process.env.NEXT_PUBLIC_ENABLE_WEBSITE_JINAREADER !== undefined
  ? process.env.NEXT_PUBLIC_ENABLE_WEBSITE_JINAREADER === 'true'
  : globalThis.document?.body?.getAttribute('data-public-enable-website-jinareader') === 'true' || true

export const ENABLE_WEBSITE_FIRECRAWL = process.env.NEXT_PUBLIC_ENABLE_WEBSITE_FIRECRAWL !== undefined
  ? process.env.NEXT_PUBLIC_ENABLE_WEBSITE_FIRECRAWL === 'true'
  : globalThis.document?.body?.getAttribute('data-public-enable-website-firecrawl') === 'true' || true

export const ENABLE_WEBSITE_WATERCRAWL = process.env.NEXT_PUBLIC_ENABLE_WEBSITE_WATERCRAWL !== undefined
  ? process.env.NEXT_PUBLIC_ENABLE_WEBSITE_WATERCRAWL === 'true'
  : globalThis.document?.body?.getAttribute('data-public-enable-website-watercrawl') === 'true' || true

export const TONE_LIST = [
  {
    id: 1,
    name: 'Creative',
    config: {
      temperature: 0.8,
      top_p: 0.9,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    },
  },
  {
    id: 2,
    name: 'Balanced',
    config: {
      temperature: 0.5,
      top_p: 0.85,
      presence_penalty: 0.2,
      frequency_penalty: 0.3,
    },
  },
  {
    id: 3,
    name: 'Precise',
    config: {
      temperature: 0.2,
      top_p: 0.75,
      presence_penalty: 0.5,
      frequency_penalty: 0.5,
    },
  },
  {
    id: 4,
    name: 'Custom',
  },
]

export const DEFAULT_CHAT_PROMPT_CONFIG = {
  prompt: [
    {
      role: PromptRole.system,
      text: '',
    },
  ],
}

export const DEFAULT_COMPLETION_PROMPT_CONFIG = {
  prompt: {
    text: '',
  },
  conversation_histories_role: {
    user_prefix: '',
    assistant_prefix: '',
  },
}

export const getMaxToken = (modelId: string) => {
  return (modelId === 'gpt-4' || modelId === 'gpt-3.5-turbo-16k') ? 8000 : 4000
}

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
export const DEFAULT_PARAGRAPH_VALUE_MAX_LEN = 1000

export const zhRegex = /^[\u4E00-\u9FA5]$/m
export const emojiRegex = /^[\uD800-\uDBFF][\uDC00-\uDFFF]$/m
export const emailRegex = /^[\w.!#$%&'*+\-/=?^{|}~]+@([\w-]+\.)+[\w-]{2,}$/m
const MAX_ZN_VAR_NAME_LENGHT = 8
const MAX_EN_VAR_VALUE_LENGHT = 30
export const getMaxVarNameLength = (value: string) => {
  if (zhRegex.test(value))
    return MAX_ZN_VAR_NAME_LENGHT

  return MAX_EN_VAR_VALUE_LENGHT
}

export const MAX_VAR_KEY_LENGHT = 100

export const MAX_PROMPT_MESSAGE_LENGTH = 10

export const VAR_ITEM_TEMPLATE = {
  key: '',
  name: '',
  type: 'string',
  max_length: DEFAULT_VALUE_MAX_LEN,
  required: true,
}

export const VAR_ITEM_TEMPLATE_IN_WORKFLOW = {
  variable: '',
  label: '',
  type: InputVarType.textInput,
  max_length: DEFAULT_VALUE_MAX_LEN,
  required: true,
  options: [],
}

export const appDefaultIconBackground = '#D5F5F6'

export const NEED_REFRESH_APP_LIST_KEY = 'needRefreshAppList'

export const DATASET_DEFAULT = {
  top_k: 2,
  score_threshold: 0.5,
}

export const APP_PAGE_LIMIT = 10

export const ANNOTATION_DEFAULT = {
  score_threshold: 0.9,
}

export const MAX_TOOLS_NUM = 10

export const DEFAULT_AGENT_SETTING = {
  enabled: false,
  max_iteration: 5,
  strategy: AgentStrategy.functionCall,
  tools: [],
}

export const DEFAULT_AGENT_PROMPT = {
  chat: `Respond to the human as helpfully and accurately as possible. 

  {{instruction}}
  
  You have access to the following tools:
  
  {{tools}}
  
  Use a json blob to specify a tool by providing an {{TOOL_NAME_KEY}} key (tool name) and an {{ACTION_INPUT_KEY}} key (tool input).
  Valid "{{TOOL_NAME_KEY}}" values: "Final Answer" or {{tool_names}}
  
  Provide only ONE action per $JSON_BLOB, as shown:
  
  \`\`\`
  {
    "{{TOOL_NAME_KEY}}": $TOOL_NAME,
    "{{ACTION_INPUT_KEY}}": $ACTION_INPUT
  }
  \`\`\`
  
  Follow this format:
  
  Question: input question to answer
  Thought: consider previous and subsequent steps
  Action:
  \`\`\`
  $JSON_BLOB
  \`\`\`
  Observation: action result
  ... (repeat Thought/Action/Observation N times)
  Thought: I know what to respond
  Action:
  \`\`\`
  {
    "{{TOOL_NAME_KEY}}": "Final Answer",
    "{{ACTION_INPUT_KEY}}": "Final response to human"
  }
  \`\`\`
  
  Begin! Reminder to ALWAYS respond with a valid json blob of a single action. Use tools if necessary. Respond directly if appropriate. Format is Action:\`\`\`$JSON_BLOB\`\`\`then Observation:.`,
  completion: `
  Respond to the human as helpfully and accurately as possible. 

{{instruction}}

You have access to the following tools:

{{tools}}

Use a json blob to specify a tool by providing an {{TOOL_NAME_KEY}} key (tool name) and an {{ACTION_INPUT_KEY}} key (tool input).
Valid "{{TOOL_NAME_KEY}}" values: "Final Answer" or {{tool_names}}

Provide only ONE action per $JSON_BLOB, as shown:

\`\`\`
{{{{
  "{{TOOL_NAME_KEY}}": $TOOL_NAME,
  "{{ACTION_INPUT_KEY}}": $ACTION_INPUT
}}}}
\`\`\`

Follow this format:

Question: input question to answer
Thought: consider previous and subsequent steps
Action:
\`\`\`
$JSON_BLOB
\`\`\`
Observation: action result
... (repeat Thought/Action/Observation N times)
Thought: I know what to respond
Action:
\`\`\`
{{{{
  "{{TOOL_NAME_KEY}}": "Final Answer",
  "{{ACTION_INPUT_KEY}}": "Final response to human"
}}}}
\`\`\`

Begin! Reminder to ALWAYS respond with a valid json blob of a single action. Use tools if necessary. Respond directly if appropriate. Format is Action:\`\`\`$JSON_BLOB\`\`\`then Observation:.
Question: {{query}}
Thought: {{agent_scratchpad}}
  `,
}

let loopNodeMaxCount = 100

if (process.env.NEXT_PUBLIC_LOOP_NODE_MAX_COUNT && process.env.NEXT_PUBLIC_LOOP_NODE_MAX_COUNT !== '')
  loopNodeMaxCount = Number.parseInt(process.env.NEXT_PUBLIC_LOOP_NODE_MAX_COUNT)
else if (globalThis.document?.body?.getAttribute('data-public-loop-node-max-count') && globalThis.document.body.getAttribute('data-public-loop-node-max-count') !== '')
  loopNodeMaxCount = Number.parseInt(globalThis.document.body.getAttribute('data-public-loop-node-max-count') as string)

export const LOOP_NODE_MAX_COUNT = loopNodeMaxCount

export const VAR_REGEX = /\{\{(#[a-zA-Z0-9_-]{1,50}(\.[a-zA-Z_][a-zA-Z0-9_]{0,29}){1,10}#)\}\}/gi
