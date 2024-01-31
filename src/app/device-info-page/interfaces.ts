export interface DeviceHint {
    id: number;
    description: string;
    is_essential: boolean;
}

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
    type_specific_field: {};
    date: Date;
    type: string;
    device_id: string;
    files: FileInfo[];
    can_have_children: boolean;
    children: EventInfo[];
    parent_id: number;
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
    serial_number: string;
    model: string;
    installation_year: number;

    hints: DeviceHint[];
};

    
export let event_type_map = new Map<string, string>([
    ["SV", "service"],
    ["FC", "factor"],
    ['PF', 'prefactor'],
    ['II', 'investigation'],
    ['RS', 'request_serivce'],
    ["IN", "installation"],
    ["NA", "none"],
]);


export let  file_type_map = new Map<string, string>([
    ["NA", "none"],
    ["SV", "survey_form"],
    ["TC", "tool_char"],
    ["SR", "given_services"],
    ["MC", "main_check_list"]  
])

