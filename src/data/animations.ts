export type AvatarState =
  | "reading"
  | "writing"
  | "typing"
  | "thinking"
  | "notes"
  | "studying"
  | "hardProblem"
  | "struggling"
  | "shortBreak"
  | "lookingAround"
  | "stretching"
  | "backToWork"
  | "relaxing"
  | "sipping";

export interface AvatarAnimation {
  id: AvatarState;
  label: string;
  /** seconds this state usually lasts */
  duration: [number, number];
  /** relative likelihood of being picked while focusing */
  weight: number;
  /** only reachable while the session is paused / on a break */
  breakOnly?: boolean;
  /** css animation applied to the torso + head group */
  motion: "lean" | "write" | "type" | "tilt" | "scan" | "slump" | "stretch" | "rest" | "idle" | "sip";
  /** only offered in worlds with a drink on the table */
  needsDrink?: boolean;
  /** whether the desk objects react */
  penVisible?: boolean;
  bookOpen?: boolean;
  thought?: string | null;
}

export const AVATAR_ANIMATIONS: Record<AvatarState, AvatarAnimation> = {
  reading: { id: "reading", label: "Reading", duration: [22, 50], weight: 10, motion: "lean", bookOpen: true, thought: null },
  writing: { id: "writing", label: "Writing", duration: [18, 40], weight: 10, motion: "write", penVisible: true, bookOpen: true, thought: null },
  typing: { id: "typing", label: "Typing", duration: [20, 45], weight: 8, motion: "type", thought: null },
  thinking: { id: "thinking", label: "Thinking", duration: [8, 16], weight: 6, motion: "tilt", thought: "…" },
  notes: { id: "notes", label: "Checking notes", duration: [8, 18], weight: 5, motion: "lean", bookOpen: true, thought: null },
  studying: { id: "studying", label: "Studying", duration: [25, 60], weight: 12, motion: "lean", bookOpen: true, thought: null },
  hardProblem: { id: "hardProblem", label: "Hard problem", duration: [10, 20], weight: 4, motion: "tilt", thought: "?" },
  struggling: { id: "struggling", label: "Struggling a little", duration: [8, 14], weight: 3, motion: "slump", thought: "…" },
  shortBreak: { id: "shortBreak", label: "Short break", duration: [10, 20], weight: 2, motion: "rest", thought: null },
  lookingAround: { id: "lookingAround", label: "Looking around", duration: [6, 12], weight: 4, motion: "scan", thought: null },
  stretching: { id: "stretching", label: "Stretching", duration: [5, 9], weight: 3, motion: "stretch", thought: null },
  backToWork: { id: "backToWork", label: "Back to work", duration: [4, 7], weight: 2, motion: "lean", thought: null },
  relaxing: { id: "relaxing", label: "Relaxing", duration: [12, 26], weight: 1, breakOnly: true, motion: "rest", thought: null },
  sipping: { id: "sipping", label: "Taking a sip", duration: [5, 9], weight: 3, motion: "sip", needsDrink: true, bookOpen: true, thought: null },
};

export const FOCUS_STATES = Object.values(AVATAR_ANIMATIONS).filter((a) => !a.breakOnly);
export const BREAK_STATES: AvatarAnimation[] = [
  AVATAR_ANIMATIONS.relaxing,
  AVATAR_ANIMATIONS.shortBreak,
  AVATAR_ANIMATIONS.stretching,
  AVATAR_ANIMATIONS.lookingAround,
  AVATAR_ANIMATIONS.sipping,
];
