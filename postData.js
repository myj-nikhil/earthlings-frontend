import { useState } from "react";
import axios from "axios";
function ajaxPost(coordinatesArray,targetArea,isPolygon,roundedArea){
    const [data, setData] = useState(null);

    const s = JSON.stringify(coordinatesArray);
    console.log(s);
    console.log("Stringig=fied",JSON.stringify(s))
    console.log("Type of request to Python server is ", typeof s);
    console.log("JSON Stringified input:", s);
    targetArea.innerHTML = `<p>Calculating...</p>`;
    const fetchData = () => {
        fetch("/api/users")
          .then((response) => response.json())
          .then((users) => {
            setData(users);
          });
      };
    
      return (
        <div>
          <button onClick={fetchData}>Fetch Data</button>
          {data && (
            <ul>
              {data.map((user) => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          )}
        </div>
      );
}

export default ajaxPost;




function outputTable(props) {

}