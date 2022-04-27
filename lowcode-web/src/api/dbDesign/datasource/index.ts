import request from "/@/utils/request";

const base:String = "/lowcode/datasourceInfo/";
export function infoList(params: any) {
    return request({
        url: base + "list",
        method: "get",
        data : params
    });
}

export function save(params: any) {
    return request({
        url: base + "save",
        method: "post",
        data : params
    });
}

export function deleteRow(id: any) {
    return request({
        url: base + id,
        method: "delete"
    });
}