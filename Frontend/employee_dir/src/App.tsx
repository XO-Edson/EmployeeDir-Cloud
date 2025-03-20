import { useEffect, useState } from "react";

function App() {
  const [employees, setEmployees] = useState<
    { name: string; age: string; location: string; image: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");

  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://51.20.189.216/employees");
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await response.json();
        setEmployees(data); // Set the fetched employees in state
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const addBtn = async () => {
    if (input.trim() !== "" && image) {
      const formData = new FormData();
      formData.append("name", input);
      formData.append("age", age.toString()); // Assuming you have an age input field
      formData.append("location", location); // Assuming you have a location input field
      formData.append("image", image);

      try {
        const response = await fetch("http://51.20.189.216//employees", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to add employee");
        }

        const data = await response.json();

        setEmployees([
          ...employees,
          { name: input, age, location, image: data.imageUrl }, // Use the URL returned from backend
        ]);

        setInput("");
        setAge(""); // Reset age input
        setLocation(""); // Reset location input
        setImage(null);
      } catch (error) {
        console.error("Error adding employee:", error);
      }
    }
  };

  return (
    <section>
      <h1>Employee Dir.</h1>
      <div className="input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Employee Name"
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter Age"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter Location"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />
      </div>
      <button onClick={addBtn}> ADD</button>

      <div className="names">
        {employees.map((employee, index) => (
          <div key={index} className="employee">
            <img
              src={employee.image}
              alt={employee.name}
              width="50"
              height="50"
            />
            <div className="employee-details">
              <p>
                <strong>Name:</strong> {employee.name}
              </p>
              <p>
                <strong>Age:</strong> {employee.age}
              </p>
              <p>
                <strong>Location:</strong> {employee.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default App;
