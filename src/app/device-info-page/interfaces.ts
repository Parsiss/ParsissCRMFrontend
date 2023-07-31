export interface EventInfo {
    id: number;
    description: string;  
    date: Date;
    type: string;
    device_id: string;
}


export interface DeviceInfo
{
    id: number;
    center_id: number;
    center: string;
    version: string;
};


export let type_map = new Map<string, string>([
    ["SERVICE", "SV"],
    ["NONE", "NA"]
]);