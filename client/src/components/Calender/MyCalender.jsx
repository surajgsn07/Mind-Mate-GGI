import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog } from "@headlessui/react";
import { v4 as uuidv4 } from "uuid";

const MyCalendar = () => {
  const [events, setEvents] = useState([
    { id: uuidv4(), title: "Meeting", date: "2024-04-05" }
  ]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  // ✅ Open Modal for Creating/Editing Event
  const openModal = (date = null, event = null) => {
    setSelectedDate(date);
    if (event) {
      setEditingEvent(event);
      setEventTitle(event.title);
    } else {
      setEditingEvent(null);
      setEventTitle("");
    }
    setModalOpen(true);
  };

  // ✅ Handle Event Creation or Update
  const handleSave = () => {
    if (!eventTitle.trim()) return;
    if (editingEvent) {
      setEvents(events.map((e) => e.id === editingEvent.id ? { ...e, title: eventTitle } : e));
    } else {
      setEvents([...events, { id: uuidv4(), title: eventTitle, date: selectedDate }]);
    }
    setModalOpen(false);
  };

  // ✅ Delete Event
  const handleDeleteEvent = (event) => {
    if (window.confirm(`Delete "${event.title}"?`)) {
      setEvents(events.filter((e) => e.id !== event.id));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Calendar */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        selectable={true}
        dateClick={(info) => openModal(info.dateStr)}
        eventClick={(clickInfo) => openModal(null, clickInfo.event)}
      />

      {/* Modal */}
      {modalOpen && (
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              {editingEvent ? "Edit Event" : "Create Event"}
            </h2>
            <input
              type="text"
              style={styles.input}
              placeholder="Enter event title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            <div style={styles.buttonContainer}>
              {editingEvent && (
                <button style={styles.deleteButton} onClick={() => handleDeleteEvent(editingEvent)}>
                  Delete
                </button>
              )}
              <button style={styles.cancelButton} onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button style={styles.saveButton} onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

// ✅ Inline CSS
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    width: "350px",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#95a5a6",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default MyCalendar;
