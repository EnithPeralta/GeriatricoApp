export interface Rol {
    rol_id: number;
    rol_nombre: string;
    ge_id?: number;
    ge_nombre: string;
    se_id?: number;   
    se_nombre: string;
    tipo: string;
}

export interface SelectRolProps {
    label: string;
    name: string;
    value: string;
    onChange: VoidFunction;
}
