const mockUser =[ {
  _id: "mock123",
  name: "Alex",
  username: "lexes",
  email: "alex@student.uni.ac.lk",
  role: "student",
  course: "Computer Science Undergraduate",
  group: "CS 2023 / Group A",
  modules: ["Java", "Web Development", "Software Engineering"],
  bio: "I am a computer-science student at IIT",
  aboutMe: "Outside of code, I enjoy building projects and learning new tech.",
  skills: ["JavaScript", "React", "Node.js", "Python"],
  profileImage: "https://i.pravatar.cc/300?img=47"
},
 {
    _id: "student1",
    name: "Nimali Perera",
    username: "nimali",
    email: "nimali@uni.edu",
    course: "Software Engineering",
    group: "Group B",
    bio: "Interested in UI/UX design.",
    aboutMe: "I love designing user interfaces.",
    modules: ["UI Design", "Human Computer Interaction"],
    skills: ["Figma", "CSS", "HTML"],
    profileImage: "https://i.pravatar.cc/150?img=5"
  },
  {
    _id: "lecturer1",
    name: "Dr. Silva",
    username: "drsilva",
    email: "silva@uni.edu",
    course: "Computer Science",
    group: "",
    bio: "Lecturer in Software Engineering.",
    aboutMe: "Teaching programming and software architecture.",
    modules: ["Software Engineering"],
    skills: ["Java", "System Design"],
    profileImage: "https://i.pravatar.cc/150?img=8"
  },
  {
  name: "Ms. Nilaskshi",
  email: "nilaskshi.n@iit.ac.lk",
  role: "lecturer", 
  expertise: ["Machine Learning", "Neural Networks"],
  department: "Computer Science",
  bio: "AI Researcher and Assistant Lecturer.",
  //profileImage: "/images-d/machine.png"
}
];

module.exports = mockUser;
