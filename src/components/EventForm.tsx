"use client"

import type React from "react"

import { useState } from "react"

interface Event {
  _id: string
  title: string
  date: string
  venue: string
  resources: string[]
  personnel: string[]
}

interface EventFormProps {
  onSubmit: (event: Omit<Event, "_id">) => Promise<void>
  onCancel: () => void
  initialData?: Omit<Event, "_id">
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    date: initialData?.date || "",
    venue: initialData?.venue || "",
    resources: initialData?.resources?.join(", ") || "",
    personnel: initialData?.personnel?.join(", ") || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.date || !formData.venue) {
      alert("Please fill in all required fields (Title, Date, Venue)")
      return
    }

    setIsSubmitting(true)

    try {
      const eventData = {
        title: formData.title,
        date: formData.date,
        venue: formData.venue,
        resources: formData.resources
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        personnel: formData.personnel
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      }

      await onSubmit(eventData)

      // Reset form if not editing
      if (!initialData) {
        setFormData({
          title: "",
          date: "",
          venue: "",
          resources: "",
          personnel: "",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{initialData ? "Edit Event" : "Add New Event"}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Event Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter event title"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            id="date"
            name="date"
            type="datetime-local"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
            Venue *
          </label>
          <input
            id="venue"
            name="venue"
            type="text"
            value={formData.venue}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter venue location"
            required
          />
        </div>

        <div>
          <label htmlFor="resources" className="block text-sm font-medium text-gray-700 mb-1">
            Resources
          </label>
          <textarea
            id="resources"
            name="resources"
            value={formData.resources}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter resources (comma-separated)"
            rows={3}
          />
          <p className="text-sm text-gray-500 mt-1">Separate multiple resources with commas</p>
        </div>

        <div>
          <label htmlFor="personnel" className="block text-sm font-medium text-gray-700 mb-1">
            Personnel
          </label>
          <textarea
            id="personnel"
            name="personnel"
            value={formData.personnel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter personnel names (comma-separated)"
            rows={3}
          />
          <p className="text-sm text-gray-500 mt-1">Separate multiple names with commas</p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : initialData ? "Update Event" : "Add Event"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EventForm
