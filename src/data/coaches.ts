import type { Coach } from '../types'

/** Coach roster and the levels each one teaches. */
export const COACHES: Coach[] = [
  // Beginner only
  { id: 'matt-williamson', name: 'Matt Williamson', levels: ['beginner'] },
  { id: 'guillermo', name: 'Guillermo', levels: ['beginner'] },

  // Beginner + Intermediate
  { id: 'george', name: 'George', levels: ['beginner', 'intermediate'] },
  { id: 'carlos', name: 'Carlos', levels: ['beginner', 'intermediate'] },
  { id: 'troy', name: 'Troy', levels: ['beginner', 'intermediate'] },
  { id: 'mike-muryn', name: 'Mike Muryn', levels: ['beginner', 'intermediate'] },

  // Beginner + Advanced
  { id: 'elliott', name: 'Elliott', levels: ['beginner', 'advanced'] },
  { id: 'tonino', name: 'Tonino', levels: ['beginner', 'advanced'] },
  { id: 'daniel-ayala', name: 'Daniel Ayala Jr.', levels: ['beginner', 'advanced'] },

  // Intermediate + Advanced
  { id: 'jesus', name: 'Jesús', levels: ['intermediate', 'advanced'] },
  { id: 'jea-yu', name: 'Jea Yu', levels: ['intermediate', 'advanced'] },
  { id: 'mark-putrino', name: 'Mark Putrino', levels: ['intermediate', 'advanced'] },
  { id: 'patrick', name: 'Patrick', levels: ['intermediate', 'advanced'] },
  { id: 'byung-kim', name: 'Byung Kim', levels: ['intermediate', 'advanced'] },
  { id: 'frederic', name: 'Frederic', levels: ['intermediate', 'advanced'] },
  { id: 'brett', name: 'Brett', levels: ['intermediate', 'advanced'] },
  { id: 'dominic', name: 'Dominic', levels: ['intermediate', 'advanced'] },
  { id: 'andrew-murtha', name: 'Andrew Murtha', levels: ['intermediate', 'advanced'] },

  // Advanced only
  { id: 'brendan', name: 'Brendan', levels: ['advanced'] },
  { id: 'daniel-hansen', name: 'Daniel Hansen', levels: ['advanced'] },

  // All levels
  { id: 'juri', name: 'Juri', levels: ['all'] },
]

export const coachById = (id: string) => COACHES.find((c) => c.id === id)
export const coachName = (id: string) => coachById(id)?.name ?? 'GOAT Academy'
