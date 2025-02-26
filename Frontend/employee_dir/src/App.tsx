import { useState } from "react";

function App() {
  const [employees, setEmployees] = useState<{ name: string; image: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const addBtn = () => {
    if (input.trim() !== "" && image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmployees([
          ...employees,
          { name: input, image: reader.result as string },
        ]);
        setInput("");
        setImage(null);
      };
      reader.readAsDataURL(image); // Convert image to base64 string for display
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
            <p>{employee.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default App;
