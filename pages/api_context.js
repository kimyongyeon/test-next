// Context API 활용하기 
// 여러 콘텍스트를 중첩해서 사용하기
// 하위 컴포넌트에서 콘텍스트 데이터를 수정하기 

const { useState } = require("react");

// React.createContext 함수구조
// React.createContext(defaultValue) => {Provider, Consumer}
const UserContext = React.createContext('');
const SetUserContext = React.createContext(() => { });

// Context API로 데이터 전달하기 
function App() {
    const [user, setUser] = useState({ username: "mike", helloCount: 0 });
    /**
     * Provider 컴포넌트의 속성값이 변경되면, 하위의 모든 consumer 컴포넌트는 다시 렌더링 된다. 
     * 한가지 중요한점, 중간에 위치한 컴포넌트의 랜더링 여부와 상관없이 consumer 컴포넌트는 다시 랜더링된다는 점
     */
    return (
        <div>
            <SetUserContext.Provider value={setUser} >
                <UserContext.Provider value={user}>
                    <Profile />
                </UserContext.Provider>
            </SetUserContext.Provider>
        </div>
    );
}

function Greeting() {
    return (
        <SetUserContext.Consumer>
            {setUser => (
                <UserContext.Consumer>
                    {({ username, helloCount }) => (
                        <React.Fragment>
                            <p>{`${username}님 안녕하세요.`}</p>
                            <p>{`인사횟수: ${helloCount}`}</p>
                            <button
                                onClick={() => setUser({ username, helloCount: helloCount + 1 })}
                            >인사하기</button>
                        </React.Fragment>
                    )}
                </UserContext.Consumer>
            )}
        </SetUserContext.Consumer>
    )
}

const Profile = React.memo(() => { // memo 사용으로 최초 한번만 랜더링 
    return (
        <div>
            <Greeting />
        </div>
    );
});


