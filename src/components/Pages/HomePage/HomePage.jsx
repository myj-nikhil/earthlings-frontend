/* eslint-disable react/no-unescaped-entities */

import "./HomePage.css";
import LogoutButton from "../../Buttons/LogoutButton/LogoutButton";
//This is the home page of our website
export default function HomePage() {

  return (
    <>
      <div>
        <LogoutButton/>
        <p>
          ProjectXYZ is an automated easy to use real estate website that uses
          google's earth engine to populate listings with satellite data in
          order for prospective buyers to make better informed decisions and
          explore opportunities in distant lands! Just plot out your property
          from the comfort of your home or by walking through its periphery, and
          watch it get populated with parameters like population density,
          average rainfall, average temperature, soil organic content, average
          cloud cover and much much more including onground data collected from
          locals that also lets you discover one of its parameter’s percentile
          in comparison to the vicinity, district, state, country or even the
          world as we scale up.
        </p>
        <p style={{ marginTop: "22px" }}>
          Not interested in selling unless you get a very good price for it? No
          problem, list your property accordingly and get recommendations
          towards how it can be used to generate value through options like
          leasing it out, planting trees and the value they can generate as a
          function of time etc. –instantaneously on your screen and entirely
          without human interaction.
        </p>

        <p style={{ marginTop: "100px" }}>Try it now!</p>
        <div id="buttons-container" style={{ marginTop: "80px" }}>
          <p>
            <a href="/coordinates">Enter Point Coordinates</a>
          </p>
          <p>
            <a href="/map">Select on Map</a>
          </p>
          <p>
            <a href="/diagonal-coordinates">
              Enter boundary coordinates/Walk across periphery of the land(Mobile app)
            </a>
          </p>
          <p>
            <a href="/form">List a property</a>
          </p>
          <p>
            <a href="/edit-form">Edit property details</a>
          </p>
          <p>
            <a href="/edit-details">Edit profile details</a>
          </p>
        </div>
        <div id="bottom" style={{ position: "relative", marginTop: "155px" }}>
          <p style={{ margin: "0", padding: "0" }}>
            <b>Footnote:</b>
            <br />
            Website/mobile app is in very early stages, please do not share
            unnecessarily.
          </p>
          <br />
          <p style={{ margin: "0", padding: "0" }}>
            projectxyz is a cog in a larger overarching idea, and will be listed
            as a non-profit in order for the parent organization to open up this
            wing’s true potential, ranging from opportunities for city dwellers
            to interact with and experience the countryside to agrivoltaics and
            reforestation of abused forests etc.
          </p>
          <p style={{ margin: "0", padding: "0" }}>
            Trees are life. Just go out on a highway and picture what life would
            be like living in a home on a barren piece of land and how different
            the same house would be if it had trees surrounding it.
          </p>
        </div>
      </div>
    </>
  );
}

