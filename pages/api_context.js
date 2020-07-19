// Context API로 데이터 전달하기 
function App() {
    return (
        <div>
            <div>상단메뉴</div>
            <Profile username="mike" />
            <div>하단메뉴</div>
        </div>
    );
}

function Profile({username}) {
    return (
        <div>
            <Greeting username={username} />
        </div>
    );
}

function Greeting({username}) {
    return <p>{`${username}님 안녕하세요.`}</p>
}


