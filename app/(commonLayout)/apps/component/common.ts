import { copyCardApi } from '@/service/tools'
import { message } from 'antd';


type Copycard = {
    name: string,
    icon: string,
    icon_background: string,
    mode: string,
    app_id: string,
    callback?: (id: any) => void,
    fromType: string
    tenant_id: string
}

export const copyCard = async (copyCard: Copycard) => {
    const { name, icon, icon_background, mode, fromType, app_id, tenant_id, callback } = copyCard;
    const param = {
        name, icon,
        icon_background,
        mode,
        squre: fromType === '个人空间' ? '1' : '2',
        // tenant_id: fromType === '项目空间' ? tenant_id : undefined 
        tenant_id
    };

    const result = await copyCardApi(param, app_id);
    // console.log(result, '---------------------copy结果');
    if ('id' in result) {
        message.info('复制成功');
        callback && callback(result.id);
    } else {
        message.error('复制失败');
    }

}