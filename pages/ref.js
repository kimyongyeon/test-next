// ref 속성값으로 자식 요소에 접근하기 
// 1. ref 속성값 이해하기
// 2. ref 속성값 활용하기 : forwardRef 
// ref.current : 해당 클래스의 메서드를 호출할 수 있다. 
// useImpreativeHandle : 함수형 컴포넌트에서도 변수와 함수를 외부로 노출시킬 수 있다.
import React, { useRef, useEffect } from 'react';
function TextInput({inputRef}) {
    return (
        <div>
            {/* 접근하고자 하는 자식 요소의 ref 속성값에 ref객체를 입력한다. 
            해당 돔요소 혹은 컴포넌트가 생성되면 ref 객체로 접근할 수 있다. */}
            <input type="text" ref={inputRef} />
            <button>저장</button>
        </div>
    )
}

function Form() {
    const inputRef = useRef();
    useEffect(() => {
        inputRef.current.focus();
    }, []);
    return (
        <div>
            {/* 아래 방법은 TextInput의 내부구조를 외부에서 알아야 하기 때문에 썩 좋은 방법은 아니다. 
            따라서 손자 요소의 ref 속성값을 이용하는 방법은 꼭 필요한 경우에만 사용하기 바란다. */}
            <TextInput inputRef={inputRef} />
            <button onClick={() => inputRef.current.focus()}>텍스트로 이동</button>
        </div>
    )
}