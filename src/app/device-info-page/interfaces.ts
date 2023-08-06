

export interface FileInfo {
    id: number;
    file: string;
    filename: string;
    created_at: string;
    type: string;
};



export interface EventInfo {
    id: number;
    description: string;  
    date: Date;
    type: string;
    device_id: string;
    files: FileInfo[];
}



export interface DeviceInfo
{
    id: number;
    name: string;
    center_id: number;
    center: string;
    version: string;
    windows_version: string;
    bundle_version: string;
    system_password: string;
    files: FileInfo[];
};


export let event_type_map = new Map<string, string>([
    ["SV", "service"],
    ["NA", "none"]
]);


export let  file_type_map = new Map<string, string>([
    ["NA", "none"],
    ["SV", "survey_form"],
    ["TC", "tool_char"],
    ["SR", "given_services"],
    ["MC", "main_check_list"]  
])