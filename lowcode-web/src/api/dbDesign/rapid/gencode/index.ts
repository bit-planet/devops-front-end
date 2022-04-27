import request from "/@/utils/request";

const base:String = "/lowcode/rapid/";
export function allTables(params: any) {
    return request({
        url: base + "database/"+params,
        method: "get",
        data : params
    });
}


export function tableDetail(params: any,tableName:string) {
    return request({
        url: base + "database/" + params + "/" + tableName,
        method: "get",
        data : params
    });
}

export function genCode(params: any) {
    return request({
        url: base + "downloadCode" ,
        method: "post",
        data : params
    });
}

