import React from 'react';
import dev1 from '../../assets/dev1.jpg'; // Replace with actual images
import dev2 from '../../assets/dev2.jpg';
import dev3 from '../../assets/dev3.jpg';

const team = [
  {
    img: dev1,
    name: "Your Name",
    role: "Frontend Developer",
    bio: "Built the UI/UX and handled all visual aspects of Stoxie with a keen eye for detail.",
  },
  {
    img: dev2,
    name: "Friend 1",
    role: "Backend Developer",
    bio: "Managed APIs, authentication, and ensured a secure architecture for all services.",
  },
  {
    img: dev3,
    name: "Friend 2",
    role: "Data & Logic Dev",
    bio: "Integrated trading logic, simulated market behavior, and built visualizations.",
  },
];

const TeamSection = () => {
  return (
    <section className="about-team">
      <h2>Meet the Team</h2>
      <div className="team-cards">
        {team.map((member, index) => (
          <div className="team-card" key={index}>
            <img src={member.img} alt={member.name} />
            <h4>{member.name}</h4>
            <p className="role">{member.role}</p>
            <p>{member.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
