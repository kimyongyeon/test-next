// ref 속성값으로 자식 요소에 접근하기 
// 1. ref 속성값 이해하기
// 2. ref 속성값 활용하기 : forwardRef 
// ref.current : 해당 클래스의 메서드를 호출할 수 있다. 
// useImpreativeHandle : 함수형 컴포넌트에서도 변수와 함수를 외부로 노출시킬 수 있다.
import React, { useRef, useEffect, useState, useCallback } from 'react';

// forwardRef 함수로 ref 속성값을 직접 처리하기
const TextInput = React.forwardRef((props, ref) => ( // forwardRef 함수를 이용하면 부모컴포넌트에서 넘어온 ref 속성값을 직접 처리할 수 있다.
    <div>
        <input type="text" ref={ref} />
        <button>저장</button>
    </div>
));

// ref 속성값으로 고정된 함수 입력하기.
function Form() {
    const INITIAL_TEXT = "안녕하세요.";
    const [text, setText] = useState(INITIAL_TEXT);
    const [showText, setShowText] = useState(true);
    const setInitialText = useCallback(ref => ref && setText(INITIAL_TEXT), []);
    return (
        <div>
            {showText && (
                <input
                    type="text"
                    ref={setInitialText}
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
            )}
            <button onClick={() => setShowText(!showText)}>보이기/가리기</button>
        </div>
    )
}