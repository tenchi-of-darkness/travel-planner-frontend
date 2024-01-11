import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/app/map/map'), {
    ssr: false,
})

export default function Page() {
    return <div style={{height:"100vh"}}>
        <Map/>
    </div>
}