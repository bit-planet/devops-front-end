

export function refreshCurrentTag(proxy:any,route:any) {
    proxy.mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 0, ...route }));
}