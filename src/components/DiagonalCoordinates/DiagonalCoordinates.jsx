import './DiagonalCoordinates.css'

export default function DiagonalCoordinates (){
    return (
        <>
        <div className="home-button">
      <a href="/">Home</a>
    </div>
    <form>
      <label htmlFor="top-left-lat">Top-Left Latitude:</label>
      <input
        type="number"
        id="top-left-lat"
        name="top-left-lat"
        step="any"
      /><br />

      <label htmlFor="top-left-long">Top-Left Longitude:</label>
      <input
        type="number"
        id="top-left-long"
        name="top-left-long"
        step="any"
      /><br />

      <label htmlFor="bottom-right-lat">Bottom-Right Latitude:</label>
      <input
        type="number"
        id="bottom-right-lat"
        name="bottom-right-lat"
        step="any"
      /><br />

      <label htmlFor="bottom-right-long">Bottom-Right Longitude:</label>
      <input
        type="number"
        id="bottom-right-long"
        name="bottom-right-long"
        step="any"
      /><br />
    </form>
    <button id="submit" type="submit">Get Data</button>
    {/* <!-- <button style="margin-top: 10px;"id="submit2" type="submit">Get Soil Data</button> --> */}
    <script src="{{ url_for('static', filename='diagCoord.js')}}"></script>
    <div id="ans"></div>
        </>
    )
}