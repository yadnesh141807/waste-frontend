import "./AboutUs.css";

function AboutUs({ setPage }) {
  return (
    <div className="about-wrapper">

      <header className="about-header">
        <h1>About Waste Management System</h1>
        <button onClick={() => setPage("home")}>⬅ Back</button>
      </header>

      <section className="about-content">
        <p>
          Our Waste Management System is designed to help users manage
          household and commercial waste efficiently.
        </p>

        <p>
          Users can submit waste details, track status, and schedule pickups,
          while admins manage and approve requests.
        </p>

        <h3>Why Choose Us?</h3>
        <ul>
          <li>Eco-friendly waste handling</li>
          <li>Real-time waste tracking</li>
          <li>Easy pickup scheduling</li>
          <li>User & Admin dashboards</li>
        </ul>
      </section>
    </div>
  );
}

export default AboutUs;
