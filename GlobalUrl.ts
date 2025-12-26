
import { getQueryParams } from "./utils/getUrlParams";


let GlobalUrl = {
    // defaultUrlIp: 'http://117.89.254.31:7002',
    defaultUrlIp: 'https://10.141.179.170:20080/agent-platform-test',
    //http://172.27.221.54:5001/  http://10.142.78.100:9520
    RedirectIp: 'http://localhost:3000',
    shufa_ip: 'http://10.37.63.178:9100',
    // shufa_rongqi_ip: 'http://agent-platform-backend:5001',
    shufa_rongqi_ip: 'http://agent-platform-backend-v1-prod:5002/agent-platform',
    platform_type: "",

    encryption: true, //是否调用加密接口
    //网运
    // wangyun_defaultUrlIp_agent_platform: 'http://117.89.254.31:7002',
    wangyun_defaultUrlIp_agent_platform: 'https://10.141.179.170:20080/agent-platform-test',
    // wangyun_defaultUrlIp_no_agent_platform: 'http://117.89.254.31:7002',
    // 和训推相关的接口
    wangyun_defaultUrlIp_no_agent_platform: 'https://10.141.179.170:20080',
    // 运维平台
    agent_operation_platform: 'https://10.141.179.170:20080/agent_operation_web',
    agent_auth: 'https://10.141.179.170:20080/agentauth'
};
// 访问地址:http://10.37.63.178:9100  http://172.27.221.54/
// 提供修改 `defaultUrlIp` 的方法
//http://117.89.254.31/
export function setPlatformType(platform_type: any) {
    GlobalUrl.platform_type = platform_type;
    localStorage.setItem('platform_type', platform_type);
}

export function getPlatformType() {
    const platform_type = GlobalUrl.platform_type || localStorage.getItem('platform_type');
    return platform_type;
}

export function setDefaultUrlIp(newUrl: any) {
    // GlobalUrl.defaultUrlIp = newUrl;
}
// 判断当前浏览器 URL 是否包含目标 IP
export function checkBrowserUrl(): boolean {
    // const url = window.location.href;
    if (GlobalUrl.defaultUrlIp.includes("10.37.63.179") || GlobalUrl.defaultUrlIp.includes("10.142.78.100") || GlobalUrl.defaultUrlIp.includes("117.89.254.31")) {
        return true;
    } else {
        return false;
    }
    // else if (url.includes("10.37.63.179")) {

    // }
}
export default GlobalUrl;

// 从其他平台跳转到智能体平台时，根据其他平台token获取智能体平台token
export async function getNewToken(callback?: () => void) {

    const newWindowsToken = getQueryParams('console_token')
    const console_token_save = localStorage.getItem('console_token_save');
    const windowsToken = localStorage.getItem('windowsToken');
    console.log(newWindowsToken && newWindowsToken.length <= 50, newWindowsToken !== windowsToken, 'newWindowsToken && (newWindowsToken.length <= 50 && newWindowsToken !== windowsToken)');

    // if (newWindowsToken && !(newWindowsToken === console_token_save || newWindowsToken === windowsToken)) {
    if (newWindowsToken && (newWindowsToken.length <= 50)) {
        const url = GlobalUrl.agent_auth + '/api/auth/profile-encrypt';
        // const url = 'http://172.16.3.81:21017/agentauth/api/auth/profile-encrypt';
        const data = { token: newWindowsToken }


        if (newWindowsToken !== windowsToken) {
            const response = await fetch(url, {
                method: "POST", // 指定请求方法是POST
                headers: {
                    'Content-Type': 'application/json' // 设置请求头
                },
                body: JSON.stringify(data) // 要发送的数据体
            })
                .then(response => {
                    console.log('Response对象:', response);

                    // 检查HTTP状态码
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    // 解析JSON数据
                    return response.json();
                })
                .then(response => {
                    if (response.code + '' === '200' && response?.data?.encryptedData) { // HTTP 状态码在200-299之间被认为是成功的
                        localStorage.setItem('console_token', response?.data?.encryptedData);
                        localStorage.setItem('console_token_save', response?.data?.encryptedData);
                        localStorage.setItem('windowsToken', newWindowsToken);
                    }
                })
                .catch(error => {
                    // 处理请求中的错误
                    console.error('There was a problem with your fetch operation:', error);
                });
        } else {
            console_token_save && localStorage.setItem('console_token', console_token_save);
        }

    }
}