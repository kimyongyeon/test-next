import Head from 'next/head';
import { add } from '../src/util';

import styled from 'styled-components';
const MyP = styled.div`
    color: red;
    font-size: 18pt;
`;

function Page1() {
    return (
        <div>
            <p>this is home page</p>
            <p>{`10+20=${add(10, 20)}`}</p>
            <MyP>{`10+20=${add(10, 20)}`}</MyP>
            <Head>
                <title>page1</title>
            </Head>
            <Head>
                <meta name="description" content="hello world"/>
            </Head>
            <style jsx>{`
                p {
                    color: blue;
                    font-size: 18pt;
                }
            `}</style>
        </div>
    );
}
export default Page1;