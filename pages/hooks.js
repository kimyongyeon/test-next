import React, { useState, useEffect } from 'react';
import { subscribeToUserStatus, unsubscribeToUserStatus } from '../src/util';

Profile.getInitialProps = async ({ query }) => {
    const userId = query.userId || 'none';
    return { userId };
};

function Profile({ userId }) {
    const [state, setState] = useState({ name: '', age: 0 });
    const [user, setUser] = useState(null);

    async function fetchUser(fetchState) {
        await subscribeToUserStatus(userId) // 구독 
            .then(r => {
                if (r) {
                    console.log("then: " + fetchState.cancel);
                    if (fetchState.cancel) { // 화면 빠져 나가고 돌아온 값은 훅처리 하지 않는다.
                        console.log("then cancel true: " + fetchState.cancel, r);
                        return; 
                    }
                    setUser(r);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }
    // api, event 같은 것들을 처리할때 사용하라.
    // 문제는 cleanup function 에러가 나고 있다. 왜 메모리는 누수가 생길까?
    // useEffect: 랜더링 이후 어떤일을 수행하는것
    // 외부에서 구독하는 경우 clean-up(정리)이 필요하다.
    // http://www.abigstick.com/2019/09/15/cancelling-react-state-updates.html
    useEffect(
        () => {
            const fetchState = {cancel: false};
            console.log("useEffect: " + fetchState.cancel);
            fetchUser(fetchState);
            // effect 이후에 어떻게 정리(clean-up)할 것인지 표시합니다. 
            return function cleanup() {
                console.log("cleanup: " + fetchState.cancel);
                fetchState.cancel = true;
            }
        },
        [userId],
    );
    return (
        <div>
            {!user && <p> 사용자 정보를 가져오는 중...</p>}
            {user && (
                <>
                    <p>{`name is ${user.name}`}</p>
                    <p>{`age is ${user.age}`}</p>

                    <p>{`name is ${state.name}`}</p>
                    <p>{`age is ${state.age}`}</p>
                    <MyComponent />
                    <input type="text"
                        value={state.name}
                        onChange={e => setState({ ...state, name: e.target.value })}
                    />
                    <input type="text"
                        value={state.age}
                        onChange={e => setState({ ...state, age: e.target.value })}
                    />
                </>
            )}

        </div>
    )
}

function MyComponent() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        document.title = `업데이트 횟수: ${count}`; // 돔제어 부수효과
    }, [count]); // 성능 최적화를 위해서 count를 배열로 전달한다.
    return <button onClick={() => setCount(count + 1)}>increase</button>;
}

export default Profile;