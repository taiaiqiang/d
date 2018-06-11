type params = {
    type: string,
    status?: string,
    [otherProp: string]: any
};

// type statusSymbol = {
//     loading: Symbol,
//     success: Symbol,
//     error: Symbol,
//     cancel: Symbol,
// };
// const statusSymbol: statusSymbol = {
//     loading: Symbol('loading'),
//     success: Symbol('success'),
//     error: Symbol('error'),
//     cancel: Symbol('cancel'),
// };

export default function (params: params) {
    const { type, status = 'success', ...other } = params
    return { type: `${type}/${status}`, ...other };
};