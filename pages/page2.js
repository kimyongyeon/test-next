import { callApi } from '../src/api';
import Router from 'next/router';

Page2.getInitialProps = async ({query}) => {
    const { sayHello } = await import('../src/sayHello');
    console.log(sayHello());
    // throw new Error('exception in getInitialProps');
    const text = query.text || 'none';
    const data = await callApi();
    return { text, data };
};

export default function Page2({text, data}) {
    function onClick() {
        // 동적임포트: 코드분할 하기 
        import('../src/sayHello').then(({sayHello}) => console.log(sayHello()));
    }
    return (
        <div>
            <p>this is home page2</p>
            <button onClick={onClick}>sayHello</button>
            <p>{`text: ${text}`}</p>
            <p>{`data: ${data}`}</p>
        </div>
    );
}