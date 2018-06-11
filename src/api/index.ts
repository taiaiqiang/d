
type baseParams = {
    delay?: number,
    success?: boolean,
    data?: any
};
const Base = ({ delay = 2000, success = true, data }: baseParams) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (success) {
            resolve(data)
        } else {
            reject({ err: '失败' });
        }
    }, delay);
})

export default {
    login: () => Base({ data: { name: 'tim', id: 1, isLogin: true},success:true }),
    logout: () => Base({ data: {isLogin: false } }),
}