// React.createContext 함수구조
// React.createContext(defaultValue) => {Provider, Consumer}
const UserContext = React.createContext('');

// Context API로 데이터 전달하기 
function App() {
    const [username, setUsername] = useState('');
    /**
     * Provider 컴포넌트의 속성값이 변경되면, 하위의 모든 consumer 컴포넌트는 다시 렌더링 된다. 
     * 한가지 중요한점, 중간에 위치한 컴포넌트의 랜더링 여부와 상관없이 consumer 컴포넌트는 다시 랜더링된다는 점
     */
    return (
        <div>

            <UserContext.Provider value={username}>
                <Profile />
            </UserContext.Provider>
            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
        </div>
    );
}

const Profile = React.memo(() => { // memo 사용으로 최초 한번만 랜더링 
    return (
        <div>
            <Greeting />
        </div>
    );
});
    

function Greeting() {
    return ( // Provider 값 바뀌면 같이 바뀐다.
        <UserContext.Consumer>
            <p>{username => `${username}님 안녕하세요.`}</p>
        </UserContext.Consumer>
    )
}


