import type { FC } from 'react'
import Tooltip from '@/app/components/base/tooltip'
import { BlockEnum } from '../../types';
import BlockIcon from '../../block-icon';
import { useGetLanguage } from '@/context/i18n'
import Image from 'next/image';
import mcp1 from '@/public/image/mcp_2.png'



const GetMcpListNode: FC = (props) => {

    const { onSelect } = props as any;
    const language = useGetLanguage()

    const toolWithProvider = {
        "id": "junjiem/mcp_sse/mcp_sse",
        "author": "junjiem",
        "name": "junjiem/mcp_sse/mcp_sse",
        "description": {
            "zh_Hans": "使用 MCP 协议发现和调用工具。",
            "en_US": "Fetch and call tools by MCP protocol.",
            "pt_BR": "Fetch and call tools by MCP protocol.",
            "ja_JP": "Fetch and call tools by MCP protocol."
        },
        "icon": "http://127.0.0.1:5002/console/api/workspaces/current/plugin/icon?tenant_id=ec8aed8c-433b-4c0a-b217-a96a024898c7&filename=221f13757d18412c5db453374c10f539c671216dcc29456ed4695e86b9c756e8.png",
        "label": {
            "zh_Hans": "发现和调用 MCP 工具",
            "en_US": "MCP tools",
            "pt_BR": "MCP tools",
            "ja_JP": "MCP tools"
        },
        "type": "builtin",
        "team_credentials": {
            "servers_config": "{\"server_name\": {\"url\": \"http://172.27.221.51:8022/sse\", \"headers\": {}, \"timeout\": 50, \"sse_read_timeout\": 50}}"
        },
        "is_team_authorization": true,
        "allow_delete": true,
        "tools": [
            {
                "author": "junjiem",
                "name": "mcp_sse_call_tool",
                "label": {
                    "en_US": "Call MCP Tool",
                    "zh_Hans": "MCP",
                    "pt_BR": "Call MCP Tool",
                    "ja_JP": "Call MCP Tool"
                },
                "description": {
                    "en_US": "Call MCP Server tool.",
                    "zh_Hans": "调用 MCP 服务端工具。",
                    "pt_BR": "Call MCP Server tool.",
                    "ja_JP": "Call MCP Server tool."
                },
                "parameters": [
                    {
                        "name": "tool_name",
                        "label": {
                            "en_US": "Tool Name",
                            "zh_Hans": "工具名称",
                            "pt_BR": "Tool Name",
                            "ja_JP": "Tool Name"
                        },
                        "human_description": {
                            "en_US": "Name of the tool to execute.",
                            "zh_Hans": "要执行的工具的名称。",
                            "pt_BR": "Name of the tool to execute.",
                            "ja_JP": "Name of the tool to execute."
                        },
                        "placeholder": null,
                        "type": "string",
                        "form": "llm",
                        "llm_description": "Name of the MCP tool to execute.",
                        "required": true,
                        "default": null,
                        "min": null,
                        "max": null,
                        "options": null
                    },
                    {
                        "name": "arguments",
                        "label": {
                            "en_US": "Arguments",
                            "zh_Hans": "参数",
                            "pt_BR": "Arguments",
                            "ja_JP": "Arguments"
                        },
                        "human_description": {
                            "en_US": "Tool arguments (JSON string in the python dict[str, Any] format).",
                            "zh_Hans": "工具的参数。",
                            "pt_BR": "Tool arguments (JSON string in the python dict[str, Any] format).",
                            "ja_JP": "Tool arguments (JSON string in the python dict[str, Any] format)."
                        },
                        "placeholder": null,
                        "type": "string",
                        "form": "llm",
                        "llm_description": "MCP Tool arguments (JSON string in the python dict[str, Any] format).",
                        "required": true,
                        "default": null,
                        "min": null,
                        "max": null,
                        "options": null
                    },
                    {
                        "name": "resources_as_tools",
                        "label": {
                            "en_US": "MCP Resources as Tools",
                            "zh_Hans": "MCP 资源作为工具",
                            "pt_BR": "MCP Resources as Tools",
                            "ja_JP": "MCP Resources as Tools"
                        },
                        "human_description": {
                            "en_US": "Fetch and call the preset MCP Resources as Tools.",
                            "zh_Hans": "将预设的 MCP Resources 作为 Tools 返回和调用。",
                            "pt_BR": "Fetch and call the preset MCP Resources as Tools.",
                            "ja_JP": "Fetch and call the preset MCP Resources as Tools."
                        },
                        "placeholder": null,
                        "type": "boolean",
                        "form": "form",
                        "llm_description": "",
                        "required": true,
                        "default": 1,
                        "min": null,
                        "max": null,
                        "options": null
                    },
                    {
                        "name": "prompts_as_tools",
                        "label": {
                            "en_US": "MCP Prompts as Tools",
                            "zh_Hans": "MCP 提示词作为工具",
                            "pt_BR": "MCP Prompts as Tools",
                            "ja_JP": "MCP Prompts as Tools"
                        },
                        "human_description": {
                            "en_US": "Fetch and call the preset MCP Prompts as Tools.",
                            "zh_Hans": "将预设的 MCP Prompts 作为 Tools 返回和调用。",
                            "pt_BR": "Fetch and call the preset MCP Prompts as Tools.",
                            "ja_JP": "Fetch and call the preset MCP Prompts as Tools."
                        },
                        "placeholder": null,
                        "type": "boolean",
                        "form": "form",
                        "llm_description": "",
                        "required": true,
                        "default": 1,
                        "min": null,
                        "max": null,
                        "options": null
                    },
                    {
                        "name": "servers_config",
                        "label": {
                            "en_US": "MCP Servers config",
                            "zh_Hans": "MCP 服务配置",
                            "pt_BR": "MCP Servers config",
                            "ja_JP": "MCP Servers config"
                        },
                        "human_description": {
                            "en_US": "MCP Servers config, support multiple MCP services. (Optional, Filling in this field will overwrite the MCP Servers config entered during authorization.)",
                            "zh_Hans": "MCP服务配置，支持多个MCP服务。 （选填，填写后将覆盖授权时填写的MCP服务配置。）",
                            "pt_BR": "MCP Servers config, support multiple MCP services. (Optional, Filling in this field will overwrite the MCP Servers config entered during authorization.)",
                            "ja_JP": "MCP Servers config, support multiple MCP services. (Optional, Filling in this field will overwrite the MCP Servers config entered during authorization.)"
                        },
                        "placeholder": null,
                        "type": "string",
                        "form": "llm",
                        "llm_description": "",
                        "required": false,
                        "default": null,
                        "min": null,
                        "max": null,
                        "options": null
                    }
                ],
                "labels": [
                    "通用"
                ],
                "create_time": "2024-05-26 13:51:00",
                "sub": false,
                "subscribe_count": 0,
                "lk": false,
                "like_count": 0
            }
        ],
        "labels": [
            "utilities"
        ],
        "status": null,
        "header_image": null,
        "is_auditing": false,
        "created_time": null
    }

    const tool = toolWithProvider.tools[0]

    return <Tooltip
        key={tool.name}
        selector={`workflow-block-tool-${tool.name}`}
        position='right'
        className='!p-0 !px-3 !py-2.5 !w-[200px] !leading-[18px] !text-xs !text-gray-700 !border-[0.5px] !border-black/5 !bg-transparent !rounded-xl !shadow-lg'
        htmlContent={(
            <div>
                <BlockIcon
                    size='md'
                    className='mb-2'
                    type={BlockEnum.Tool}
                    toolIcon={toolWithProvider.icon}
                />
                <div className='mb-1 text-sm leading-5 text-gray-900'>{tool.label[language]}</div>
                <div className='text-xs text-gray-700 leading-[18px]'>{tool.description[language]}</div>
            </div>
        )}
        noArrow
    >
        <div
            className='flex items-center px-3 w-full h-8 rounded-lg hover:bg-gray-50 cursor-pointer'
            onClick={() => onSelect(BlockEnum.Tool, {
                provider_id: toolWithProvider.id,
                provider_type: toolWithProvider.type,
                provider_name: toolWithProvider.name,
                tool_name: tool.name,
                tool_label: tool.label[language],
                title: tool.label[language],
            })}
        >
            <Image src={mcp1} alt='img' width={20} className='mr-[10px] h-[20px] my-auto' />
            {/* <BlockIcon
                className='mr-2 shrink-0'
                type={BlockEnum.Tool}
                toolIcon={toolWithProvider.icon}
            /> */}
            <div className='text-sm text-gray-900 truncate'>{tool.label[language]}</div>
        </div>
    </Tooltip>
}

export default GetMcpListNode;