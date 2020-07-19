const UserContext = React.createContext('');

// Context API로 데이터 전달하기 
function App() {
    return (
        <div>
            <UserContext.Provider value="mike">
                <div>상단메뉴</div>
                <Profile />
                <div>하단메뉴</div>
            </UserContext.Provider>
        </div>
    );
}

function Profile() {
    return (
        <div>
            <Greeting />
        </div>
    );
}

function Greeting() {
    return (
        <UserContext.Consumer>
            <p>{username => `${username}님 안녕하세요.`}</p>
        </UserContext.Consumer>
    )
}


