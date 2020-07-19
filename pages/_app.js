// 공통
import Link from 'next/link';

export default function MyApp({ Component, pageProps}) {
    return (
        <div>
            <Link href="/page1">
                <a>page1 | </a>
            </Link> 
            <Link href="/page2">
                <a>page2 | </a> 
            </Link> 
            <Link href="/hooks?userId=testUser">
                <a>hooks | </a>
            </Link>
            <Link href="/api_context">
                <a>api_context</a>
            </Link>
            <Component {...pageProps} />
        </div>
    );
}