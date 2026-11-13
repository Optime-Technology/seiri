'use strict';
/** Arayüze yalnızca sınırlı masaüstü işlemlerini açar. */
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('ZamanDesktop',Object.freeze({
 vaultInfo:()=>ipcRenderer.invoke('vault:info'),
 vaultSetup:(pin,ack)=>ipcRenderer.invoke('vault:setup',pin,ack),
 vaultUnlock:(pin,scope)=>ipcRenderer.invoke('vault:unlock',pin,scope),
 vaultHello:scope=>ipcRenderer.invoke('vault:hello',scope),
 vaultSeal:(token,id,details,meta)=>ipcRenderer.invoke('vault:seal',token,id,details,meta),
 vaultOpen:(token,id,box)=>ipcRenderer.invoke('vault:open',token,id,box),
 vaultForget:(token,id)=>ipcRenderer.invoke('vault:forget',token,id),
 vaultLock:()=>ipcRenderer.invoke('vault:lock'),
 vaultChangePin:(token,oldPin,newPin)=>ipcRenderer.invoke('vault:change-pin',token,oldPin,newPin),
 vaultExportKeys:(token,password)=>ipcRenderer.invoke('vault:export-keys',token,password),
 vaultImportKeys:(token,password,bundle)=>ipcRenderer.invoke('vault:import-keys',token,password,bundle),
 onVaultLocked:callback=>ipcRenderer.on('vault-locked',()=>callback()),
 getInfo:()=>ipcRenderer.invoke('desktop:info'),
 schedule:items=>ipcRenderer.invoke('desktop:schedule',items),
 test:()=>ipcRenderer.invoke('desktop:test'),
 setLogin:enabled=>ipcRenderer.invoke('desktop:login',enabled),
 openExternal:url=>ipcRenderer.invoke('desktop:external',url),
 openPDF:bytes=>ipcRenderer.invoke('desktop:pdf',bytes),
 onOpenEntry:callback=>ipcRenderer.on('open-entry',(_event,id)=>callback(id)),
 onDownload:callback=>ipcRenderer.on('download-result',(_event,status)=>callback(status))
}));
