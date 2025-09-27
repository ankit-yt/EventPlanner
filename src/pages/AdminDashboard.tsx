
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { LogOut, Plus, Edit, Trash2, Calendar, MapPin, Users, Package } from "lucide-react"
import EventForm from "../components/EventForm"
import EditEventModal from "../components/EditEventModal"

interface Event {
  _id: string
  title: string
  date: string
  venue: string
  resources: string[]
  personnel: string[]
}

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const { user, logout, token } = useAuth()
  const API_BASE_URL =  "https://eventplanner-o9ao.onrender.com"

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/events`)
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }
      const data = await response.json()
      setEvents(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching events:", err)
    } finally {
      setLoading(false)
    }
  }

  const addEvent = async (eventData: Omit<Event, "_id">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        throw new Error("Failed to add event")
      }

      const newEvent = await response.json()
      setEvents((prev) => [...prev, newEvent])
      setShowAddForm(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add event")
      console.error("Error adding event:", err)
    }
  }

  const updateEvent = async (eventId: string, eventData: Omit<Event, "_id">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        throw new Error("Failed to update event")
      }

      const updatedEvent = await response.json()
      setEvents((prev) => prev.map((event) => (event._id === eventId ? updatedEvent : event)))
      setEditingEvent(null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event")
      console.error("Error updating event:", err)
    }
  }

  const deleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete event")
      }

      setEvents((prev) => prev.filter((event) => event._id !== eventId))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event")
      console.error("Error deleting event:", err)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.username}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {showAddForm ? "Cancel" : "Add New Event"}
          </button>
        </div>

        {showAddForm && (
          <div className="mb-8">
            <EventForm onSubmit={addEvent} onCancel={() => setShowAddForm(false)} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Events ({events.length})</h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No events found. Add your first event!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-gray-900">{event.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingEvent(event)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteEvent(event._id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue}</span>
                      </div>

                      {event.resources.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Package className="h-4 w-4 mt-0.5" />
                          <div className="flex flex-wrap gap-1">
                            {event.resources.map((resource, index) => (
                              <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                {resource}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {event.personnel.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 mt-0.5" />
                          <div className="flex flex-wrap gap-1">
                            {event.personnel.map((person, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {person}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {editingEvent && (
          <EditEventModal event={editingEvent} onUpdate={updateEvent} onClose={() => setEditingEvent(null)} />
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
