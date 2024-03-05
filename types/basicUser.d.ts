type BasicUser = {
    id: number;
    created_at: string;
    name: string;
    pin: string;
    account_privilege_level: string;
    organisation: number;
};

type Fine = {
    id: number;
    created_at: Date;
    reported_by: number;
    who: string;
    what: string;
    penalty_amount: number;
    media_url?: string;
    organisation: number;
    staff_id: number;
    staff?: BasicUser;
};

type Staff = {
    id: number;
    created_at: Date;
    name: string;
    fines_owed: number;
    fines_paid: number;
    fines_outstanding?: number;
    organisation: number;
};