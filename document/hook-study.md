# 리액트 훅 기초 익히기 

## 정의
훅은 함수형 컴포넌트에 기능을 추가할 때 사용하는 함수이다. 

## 하는일
- 함수형 컴포넌트에서 상태값 관리 
- 자식 요소에 접근 가능

## 버전 
- 16.8 이상 버전 사용 가능

## 장점
- 기존의 리액트의 문제를 해결해 준다. 

# 훅 함수들

# useState 
컴포넌트의 상태값을 추가할 수 있다.
```
const [name, setName] = useState('')'
```
배열의 두번째 원소는 상태값 변경 함수 
리액트는 가능하면 상태값 변경을 배치로 처리한다. 
상태값 변경 함수는 비동기로 처리되지만 그 순서가 보장된다. 

#### 클라이언트 컴포넌트 setState와 다른점   
- setState 메서드는 기존 상태값과 새로 입력된 값을 `병합`하지만, useState훅의 상태값 변경함수는 이전 상태값을 `덮어쓴다. `  
```
<input type="text"
    value={state.name}
    onChange={e => setState({ ...state, name: e.target.value })}
/>
```
이전 상태값을 덮어쓰기 때문에 ...state와 같은 코드가 필요하다.   
참고로 이전 상태값을 하나의 객체로 관리할 때는 useReducer훅을 사용하는게 좋다. 

#### 상태값 변경이 배치로 처리되지 않는 경우 
외부에서 관리되는 이벤트 처리 함수의 경우에는 상태값 변경이 배치로 처리되지 않는다.
```
function MyComponent() {
    const [count, setCount] = useState(0);
    useEffect(() => {
        function onClick() {
            setCount(prev => prev + 1);
            setCount(prev => prev + 1);
        }
        window.addEventListener('click', onClick);
        return () => window.removeEventListener('click', onClick);
    },[]);
}
```  
useEffect훅은 부수 효과를 처리하는 용도로 사용된다. 컴포넌트가 최초 랜더링 후, useEffect에 입력된 함수가 한 번만 호출되도록 작성한 코드다.
그럼 강제로 배치를 사용하게 할 수는 없는가?
```  
function onClick() {
    ReactDOM.unstable_batchedUpdates(()=> {
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
    });
}
```
> 이름에서 알 수 있듯이 안정화된 API가 아니므로 꼭 필요한 경우가 아니라면 사용하지 않는게 좋다. 

# useEffect   

## 정의
함수 실행 시 함수 외부에서 상태를 변경하는 연산을 부수효과라고 한다.   

## 부수효과
- API 호출하는 것
- 이벤트처리 함수를 등록/해제 
> 정확히 말하면 부수 효과 함수는 랜더링 결과가 실제 돔에 반영된 후에 비동기로 호출된다. 

```
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
```  

> 부수효과 함수는 랜더링 할때마다 호출되기 때문에 API 통신을 불필요하게 많이 하게 된다. 
이를 방지하기 위해서 useEffect 훅의 두번째 매개변수로 배열을 입력하면, 배열의 값이 변경되는 경우에만 함수가 호출된다.

## 리액트가 내부적으로 훅을 처리하는 방식
```
let hooks = null; // useState, useEffect .. 같은 훅이라고 생각하자.
export function useHook() {
    hooks.push(hookData); // 각 훔 함수에서는 hooks배열에 자신의 데이터를 추가한다. 
}
function process_a_component_rendering(component) {
    hooks = []; // hooks를 빈 배열로 초기화 
    component(); // 컴포넌트 내부에서 훅을 사용한만큼 hooks 배열에 데이터가 추가된다.
    let hooksForThisComponent = hooks; // 생성된 배열을 저장하고 hooks변수를 초기화한다.
    hooks = null;
}
```

# 예제소스 
```
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
```