// ref 속성값으로 자식 요소에 접근하기 
// 1. ref 속성값 이해하기
import React, { useRef, useEffect} from 'react';
function TextInput() {
    const inputRef = useRef(); // useRef훅이 반환하는 ref 객체를 자식요소에 접근할 수 있다. 
    useEffect(()=>{
        inputRef.current.focus(); // ref 객체의 current 속성을 이용하면 자식 요소에 접근할 수 있다.
    }, []);

    return (
        <div>
            {/* 접근하고자 하는 자식 요소의 ref 속성값에 ref객체를 입력한다. 
            해당 돔요소 혹은 컴포넌트가 생성되면 ref 객체로 접근할 수 있다. */}
            <input type="text" ref={inputRef}/> 
            <button>저장</button>
        </div>
    )
}
