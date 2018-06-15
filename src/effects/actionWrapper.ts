type params = {
    module?: string,
    fidld?: string,
    status?: string,
    [otherProps: string]: any
};

export default function (params: params) {
    const { type, status = 'success', ...other } = params
    return { type: `${type}/${status}`, ...other };
};