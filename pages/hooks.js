import React, { useState, useEffect } from 'react';
import { subscribeToUserStatus, unsubscribeToUserStatus } from '../src/util';

Profile.getInitialProps = async ({ query }) => {
    const userId = query.userId || 'none';
    return { userId };
};

// 리액트에서 마운트란? 컴포넌트의 첫 번째 랜더링 결과가 실제 돔에 반영된 상태를 말한다. 
function useMounted() {
    // mounted 상탯값은 첫 번째 랜더링 결과가 실제 돔에 반영된 후에 항상 참을 반환한다. 
    const [mounted, setMounted] = useState(false);
    // setMounted 함수는 한 번만 호출해도 충분하므로 의존성 배열에 빈 배열을 입력한다.
    useEffect(()=>setMounted(true), []);
    return mounted;
}

// 훅 사용시 지켜야 할 규칙
// 규칙1. 하나의 컴포넌트에서 훅을 호출하는 순서는 항상 같아야 한다.
// 규칙2. 훅은 함수형 컴포넌트 또는 커스텀훅 안에서만 호출되어야 한다. 
// 훅 사용시 규칙1을 위반한 경우
function MyComponent2() {
    // 조건에 따라 훅을 호출하면 순서가 보장되지 않는다. 
    const [value, setValue] = useState(0);
    if (value === 0) {
        const [v1, setV1] = useState(0);
    } else {
        const [v1, setV1] = useState(0);
        const [v2, setV2] = useState(0);
    }
    // 루프 안에서 훅을 호출하는 것도 순서가 보장되지 않는다. 
    for (let i=0; i<value; i++) {
        const [num, setNum] = useState(0);
    }
    // func1 함수가 언제 호출될지 알 수 없기 때문에 마찬가지로 순서가 보장되지 않는다. 
    function fun1() {
        const [num, setNum] = useState(0);
    }
}

// 왜 순서가 보장되지 않되면 안되는가?
// 우리가 useState훅에 전달한 정보는 상태값의 기본값밖에 없다. 
// 리액트가 age와 name 상태값을 구분할 수 있는 유일한 정보는 훅이 사용된 순서이다.ㅇ
function ProfileFail() {
    const [age, setAge] = setState(0);
    const [name, setName] = setState('');

    useEffect(()=> {
        setAge(23); // 만약 여기서 조건문에 의해 실행되지 않는다면... 
        // name 값은 23이 되므로 문제가 된다. 
    }, []);
}

function WidthPrinter() {
    // 커스텀 훅 : 가로길이 출력 
    function useWindowWidth() {
        const [width, setWidth] = useState(window.innerWidth);
        useEffect(() => {
            const onResize = () => setWidth(window.innerWidth);
            window.addEventListener('resize', onResize);
            return () => {
                window.removeEventListener('resize', onResize);
            };
        }, []);
        return width;
    }
    const width = useWindowWidth();
    return <div>{`width is ${width}`}</div>
}

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
            const fetchState = { cancel: false };
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
                    <WidthPrinter />
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