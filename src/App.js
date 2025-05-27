import React, { useState } from "react";
import ConfirmModal from "./components/ConfirmModal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => {});

  const handleDeleteClick = () => {
    setIsModalOpen(true);
    setOnConfirmAction(() => () => {
      // ✅ Put your delete logic here
      console.log("Listing deleted");
      setIsModalOpen(false);
    });
  };

  return (
    <div>
      <button onClick={handleDeleteClick} className="bg-red-500 px-4 py-2 text-white rounded">
        Delete Listing
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        message="Are you sure you want to delete this listing?"
        onConfirm={onConfirmAction}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;
