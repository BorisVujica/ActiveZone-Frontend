
import "../styles/about.css";

export default function About() {
  return (
    <div className="about-page">
      <div className="about-box">
        <h1>About ActiveZone</h1>

        <p className="about-intro">
          ActiveZone je moderna web aplikacija osmišljena za poticanje zdravog
          načina života kroz praćenje tjelesne aktivnosti, analizu podataka i
          edukaciju korisnika.
        </p>

        <div className="about-section">
          <h3>Naša misija</h3>
          <p>
            Naša misija je pomoći korisnicima u razumijevanju vlastitog zdravlja
            te ih motivirati na donošenje dugoročnih, održivih odluka vezanih uz
            fizičku aktivnost.
          </p>
        </div>

        <div className="about-section">
          <h3>Što ActiveZone nudi</h3>
          <ul>
            <li>Praćenje i analiza tjelesne aktivnosti</li>
            <li>Štopericu za praćanje odmora</li>
            <li>BMI kalkulator s vizualnim prikazom rezultata</li>
            <li>Demostracija security checka na bazu CAMARA open gateway</li>
            <li>Jednostavno i intuitivno korisničko sučelje</li>
          </ul>
        </div>

        <div className="about-section">
          <h3>Za koga je ActiveZone?</h3>
          <p>
            ActiveZone je namijenjen svima koji žele steći bolji uvid u vlastite
            navike, poboljšati zdravlje i razviti zdraviji stil života — bez
            obzira na razinu fizičke spremnosti.
          </p>
        </div>

        <div className="about-contact">
          <p>
            Kontakt:
            <br />
            <strong>admin@activezone.hr</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
