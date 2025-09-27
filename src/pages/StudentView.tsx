"use client"
export const dynamic = "force-dynamic"; 

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, MapPin, Users, Package, Shield } from "lucide-react"

interface Event {
  _id: string
  title: string
  date: string
  venue: string
  resources: string[]
  personnel: string[]
}

const StudentView = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Event & Activity Planner</h1>
          <p className="text-gray-600 mb-4">View all upcoming events and activities</p>
          <Link to="/admin/login" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
            <Shield className="h-4 w-4" />
            Admin Login
          </Link>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-4xl mx-auto">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-500">Loading events...</div>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 mb-4 text-gray-400" />
              <p className="text-gray-500">No events found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Events ({events.length})</h2>
              <div className="grid gap-6">
                {events.map((event) => (
                  <div key={event._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{event.title}</h3>

                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">{formatDate(event.date)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-green-500" />
                        <span>{event.venue}</span>
                      </div>

                      {event.resources.length > 0 && (
                        <div className="flex items-start gap-3">
                          <Package className="h-5 w-5 text-orange-500 mt-0.5" />
                          <div>
                            <span className="font-medium">Resources: </span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {event.resources.map((resource, index) => (
                                <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                                  {resource}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {event.personnel.length > 0 && (
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                          <div>
                            <span className="font-medium">Personnel: </span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {event.personnel.map((person, index) => (
                                <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                  {person}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentView
