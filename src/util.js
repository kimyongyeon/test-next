export function add(a, b) {
    console.log('called add ');
    return a + b;
}

// 비동기 함수 만들기 
// https://ko.reactjs.org/docs/hooks-effect.html
export function subscribeToUserStatus(userId) {
    return  new Promise(function (resolve, reject) {
        // 비동기를 표현하기 위해 setTimeout 함수를 사용 
        window.setTimeout(function () {
            // 파라메터가 참이면, 
            if (userId) {
                // 해결됨 
                resolve({name: 'testman', age: 39});
            }
            // 파라메터가 거짓이면, 
            else {
                // 실패 
                reject({name: 'error', age: -1});
            }
        }, 500);
    });
}
