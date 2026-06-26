import { concepts, conceptText } from "../lib/demoData.js";
import { Badge, Page, Panel } from "../components/UI.jsx";

export default function Concepts() {
  return (
    <Page title="OS Concepts" subtitle="Definitions, kitchen analogies, implementation notes, and examples for the selected OS syllabus only.">
      <div className="concept-list">
        {concepts.map((name) => {
          const item = conceptText(name);
          return <Panel key={name}><Badge>{name}</Badge><p><strong>Definition:</strong> {item.definition}</p><p><strong>Kitchen analogy:</strong> {item.analogy}</p><p><strong>Implemented here:</strong> {item.implementation}</p><p><strong>Example:</strong> {item.example}</p></Panel>;
        })}
      </div>
    </Page>
  );
}
