
import './Coordinates.css' 
import { config } from '../../assets/config'

function initializeMap() {
  ((g) => {
    var h,
      a,
      k,
      p = "The Google Maps JavaScript API",
      c = "google",
      l = "importLibrary",
      q = "__ib__",
      m = document,
      b = window;
    b = b[c] || (b[c] = {});
    var d = b.Map || (b.Map = {}),
      r = new Set(),
      e = new URLSearchParams(),
      u = () =>
        h ||
        // eslint-disable-next-line no-async-promise-executor
        (h = new Promise(async (f, n) => {
          (a = m.createElement("script"));
          e.set("libraries", [...r] + "");
          for (k in g)
            e.set(
              k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
              g[k]
            );
          e.set("callback", c + ".maps." + q);
          a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
          d[q] = f;
          a.onerror = () => (h = n(Error(p + " could not load.")));
          a.nonce = m.querySelector("script[nonce]")?.nonce || "";
          m.head.append(a);
        }));
    d[l]
      ? console.warn(p + " only loads once. Ignoring:", g)
      : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
  })({ key: config.MAPS_API_KEY, v: "beta" });
  console.log('Map initialized');
}

initializeMap()


function Coordinates() {

  return (
    <>
      <div className="home-button">
        <a href="/">Home</a>
      </div>

      <div id="maincontent">
        <div id="floating-panel">
          <input id="latlng" type="text" defaultValue="19.0760,72.8777" />
          <input id="submit" type="button" value="Get Data" />
          {/* <!-- <input id="submit2" type="button" value="Get Soil Data" /> --> */}
        </div>

        <div id="textdiv">
          <p>
            Note: Enter the Latitude and Longitude values in Decimal Degrees
          </p>
          <p>
            The Co-ordinates of Mumbai in Decimal Degrees: : 19.0760 , 72.8777
          </p>
          <a
            href=" https://www.wikihow.com/Get-Latitude-and-Longitude-from-Google-Maps"
            target="_blank"
          >
            https://www.wikihow.com/Get-Latitude-and-Longitude-from-Google-Maps
          </a>
        </div>
        <div id="ans"></div>
        <div id="secondans"></div>
      </div>
    </>
  );
}


export default Coordinates;