import { getTenants } from "@/service/common";

let TenantsParam: any = [];

export const getTenantsParam = async (tenantId?: string) => {
    if (TenantsParam && TenantsParam.length === 0) {
        TenantsParam = await getTenants('/getTenants');
    }
    if (tenantId) {
        return TenantsParam.filter(record => record.id === tenantId);
    } else {
        return TenantsParam;
    }
}