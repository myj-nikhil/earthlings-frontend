import { useAuth0 } from "@auth0/auth0-react";
import "./LogoutButton.css"

export default function LogoutButton () {
    const {logout} = useAuth0();

    return <div>
        <button id="logout"onClick={() => logout()}>Logout</button>
  </div>
}