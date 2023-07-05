import { useAuth0 } from "@auth0/auth0-react"

export default function LoginPage(){
    const { loginWithRedirect } = useAuth0();
    return (
        <>
        <div style={{marginTop:"250px",alignItems:"center",textAlign:"center"}}>
        <h1>EARTHLINGS</h1>
        <button style={{ width:"100px", margin:"auto"}}onClick={()=> loginWithRedirect()}>Login</button>
        </div>
        </>
    )
}